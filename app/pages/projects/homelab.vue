<script setup lang="ts">
// Dedicated architecture & operations deep dive for the homelab.
// This static route takes precedence over the generic [slug].vue page.
useHead({
  title: 'Five-Node Proxmox Infrastructure — Deep Dive — Mohaimmen Bajwa',
  meta: [
    {
      name: 'description',
      content:
        'Architecture & operations deep dive: five used office machines turned into a Proxmox platform that routes, resolves, proxies and backs up its own network — and the reasoning behind each decision.'
    }
  ]
})

const toc = [
  { id: 'context', label: 'Context & constraints' },
  { id: 'lab', label: 'Inside the lab' },
  { id: 'network', label: 'Getting on the network' },
  { id: 'nodes', label: 'Node roles, not a cluster' },
  { id: 'router', label: 'Taking over the network' },
  { id: 'services', label: 'Names & certificates' },
  { id: 'backups', label: 'Backups that restore' },
  { id: 'hardware', label: 'Trusting used hardware' },
  { id: 'diagnosis', label: 'Diagnosis log' },
  { id: 'decisions', label: 'Key decisions' },
  { id: 'stack', label: 'Stack & takeaways' }
]

const activeSection = useScrollSpy(toc.map((t) => t.id))

// Gateway address and firewall version detail are masked, not blurred.
const shots = [
  {
    src: '/shots/homelab/datacenter-manager.webp',
    w: 1124,
    h: 916,
    cap: 'Datacenter Manager — five standalone nodes and every guest in one view, with none of the quorum a cluster would demand.'
  },
  {
    src: '/shots/homelab/opnsense.webp',
    w: 1329,
    h: 500,
    cap: 'OPNsense — the lab’s own gateway. WAN and LAN ride physically separate NICs; the gateway address and version detail are redacted.'
  },
  {
    src: '/shots/homelab/proxmox-node.webp',
    w: 1914,
    h: 706,
    cap: 'pve1 — DNS, reverse proxy and the manager VM, with guest storage on its own NVMe pool separate from the boot disk.'
  },
  {
    src: '/shots/homelab/backup-server.webp',
    w: 1915,
    h: 715,
    cap: 'Backup Server — a 290 GB datastore on a dedicated node, with the router and manager VMs backing up nightly.'
  },
  {
    src: '/shots/homelab/adguard.webp',
    w: 652,
    h: 699,
    cap: 'AdGuard Home — 13,316 queries in 24 hours, 21% blocked, 10 ms average. The evidence the design is actually carrying traffic.'
  }
]

const stack = [
  'Proxmox VE',
  'Proxmox Datacenter Manager',
  'Proxmox Backup Server',
  'OPNsense',
  'Debian',
  'LXC',
  'KVM / QEMU',
  'AdGuard Home',
  'Caddy',
  'Tailscale',
  'Kea DHCP',
  'DNS-over-HTTPS',
  'Internal CA / TLS',
  'Wake-on-LAN',
  'SMART / smartctl',
  'ethtool',
  'Bash'
]
</script>

<template>
  <article class="cs">
    <div class="wrap">
      <!-- breadcrumb -->
      <div class="cs__crumb">
        <NuxtLink to="/#project" class="mono cs__back">← back to portfolio</NuxtLink>
      </div>

      <!-- hero -->
      <header class="cs__hero">
        <p class="eyebrow"><span class="only-code">//</span>architecture &amp; operations deep dive</p>
        <h1 class="cs__title">Five-Node Proxmox Infrastructure</h1>
        <p class="cs__lede">
          Five used office machines turned into a platform that routes, resolves, proxies and backs
          up the network it sits on — built deliberately as standalone nodes rather than a cluster,
          and documented decision by decision, including the ones that were rejected.
        </p>
        <div class="cs__meta mono">
          <div><span class="k">Role</span><span class="v">Architect &amp; operator</span></div>
          <div><span class="k">Timeline</span><span class="v">2026 — present · in service</span></div>
          <div><span class="k">Platform</span><span class="v">Proxmox VE · OPNsense · Debian</span></div>
          <div><span class="k">Hardware</span><span class="v">5 × Dell OptiPlex SFF, ~$260</span></div>
        </div>
      </header>

      <div class="cs__layout">
        <!-- TOC -->
        <aside class="cs__tocwrap">
          <p class="cs__toctitle mono">Contents</p>
          <ol class="cs__toc">
            <li v-for="t in toc" :key="t.id">
              <a
                :href="`#${t.id}`"
                :class="{ 'is-active': activeSection === t.id }"
                :aria-current="activeSection === t.id ? 'true' : undefined"
              >{{ t.label }}</a>
            </li>
          </ol>
        </aside>

        <!-- main -->
        <main class="cs__body">
          <!-- 01 CONTEXT -->
          <section id="context" v-reveal>
            <h2><span class="num">01</span>Context &amp; constraints</h2>
            <p class="lede">
              Five second-hand Dell OptiPlex small-form-factor machines, bought for roughly $260 CAD
              in total, running Proxmox VE. The goal was to learn infrastructure by operating it
              rather than reading about it — on hardware where a mistake costs an evening instead of
              an invoice.
            </p>
            <p>
              What turned it from a pile of machines into a design problem was a specific failure.
              The house router's firmware had no field for handing out a DNS server, so every device
              on the network silently resolved through the ISP instead of the lab's own filtering
              resolver. It had been that way for weeks before anyone noticed, because the fallback
              worked. Fixing that properly is what eventually justified the lab running its own
              router.
            </p>
            <h3>Constraints that shaped the design</h3>
            <ul>
              <li><strong>It lives in a bedroom.</strong> Five machines running continuously is about
                150 W — a small space heater that never switches off, plus five fans and three
                spinning disks. Nodes have to be able to sleep and wake on demand.</li>
              <li><strong>No ethernet in the room.</strong> The router is on a different floor, the
                lab can't move, and — as it turned out — neither can the router.</li>
              <li><strong>Unknown hardware provenance.</strong> Five machines from a reseller, sold
                as wiped, with no service history and disks of unknown age.</li>
              <li><strong>The household can't be collateral.</strong> Anything that breaks in the lab
                must not take the family's internet down with it.</li>
            </ul>
          </section>

          <!-- 02 LAB -->
          <section id="lab" v-reveal>
            <h2><span class="num">02</span>Inside the lab</h2>
            <p class="lede">
              The running system — the aggregated node view, the router the lab built for itself, a
              node's guest and storage layout, the backup datastore, and the resolver carrying real
              traffic.
            </p>
            <div class="shots">
              <figure v-for="(s, i) in shots" :key="s.src" class="shot">
                <a :href="s.src" target="_blank" rel="noopener" class="shot__frame">
                  <img
                    :src="s.src"
                    :alt="s.cap"
                    loading="lazy"
                    decoding="async"
                    :width="s.w"
                    :height="s.h"
                  />
                </a>
                <figcaption>
                  <span class="mono fig">fig. {{ String(i + 1).padStart(2, '0') }}</span>
                  {{ s.cap }}
                </figcaption>
              </figure>
            </div>
            <p class="shots__note mono">
              <span class="only-code">// </span>redacted regions are masked, not blurred — the underlying pixels are destroyed.
            </p>
          </section>

          <!-- 03 NETWORK -->
          <section id="network" v-reveal>
            <h2><span class="num">03</span>Getting on the network</h2>
            <p class="lede">
              The single longest-running blocker in the build, and none of it was technical. The
              interesting part is not the answer — it's the four options that had to be eliminated to
              arrive at it.
            </p>

            <div class="layers steps">
              <div class="layer">
                <span class="tier mono">Move the machines</span>
                <span class="body">The right answer in the abstract, and free. <b>Rejected for
                  household reasons</b> — and it would also have solved the heat and noise problem
                  before it existed.</span>
              </div>
              <div class="layer">
                <span class="tier mono">Move the router</span>
                <span class="body">Depends entirely on how the internet arrives. On DSL the modem can
                  often move to any phone jack. <b>It's fibre</b> — the ONT is fixed at the wall
                  penetration where the installer drilled. Dead end.</span>
              </div>
              <div class="layer">
                <span class="tier mono">MoCA</span>
                <span class="body">Genuinely the elegant option: gigabit over existing coax, no
                  drilling. Real effort went into it before discovering <b>the “coax jack” in the room
                  was an RJ11 phone jack</b>. MoCA needs an F-connector at both ends. Dead end.</span>
              </div>
              <div class="layer">
                <span class="tier mono">Wireless bridge</span>
                <span class="body">Rejected on principle, not price. Proxmox builds its networking
                  around a Linux bridge so guests share the host NIC, and <b>wireless interfaces
                  cannot be bridged</b> — 802.11 does not let a client relay frames for other MAC
                  addresses.</span>
              </div>
              <div class="layer arrow">↓</div>
              <div class="layer">
                <span class="tier mono">Run a cable</span>
                <span class="body"><b>150 ft of flat Cat6, $35.99.</b> Flat cable is about a
                  millimetre thick and tucks under baseboard trim in a way round cable can't. Pure
                  copper rather than copper-clad aluminium, because CCA gets flaky over long runs —
                  which is exactly the failure a 150 ft run would expose.</span>
              </div>
            </div>

            <div class="callout">
              <span class="label mono">The $5 mistake worth writing down</span>
              <p>
                Two RJ45 “splitters” were bought alongside the cable. They are not switches — they're
                passive adapters that split eight wires into two four-wire pairs, so both links cap at
                100 Mbps, because gigabit needs all four pairs. They also only work as a matched pair,
                one at each end of a single run.
              </p>
            </div>

            <p>
              A first attempt used a 75 ft cable that reached — stretched across the floor, untucked.
              Routed properly along baseboards and around door frames, real length runs 20–30% over
              the direct path. An RJ45 coupler to join two shorter cables was considered and rejected:
              it works, but it adds a connection point that can work loose and produce intermittent
              link failures, which is the kind of fault that gets misdiagnosed as software for hours.
              A single run was worth the $36.
            </p>
          </section>

          <!-- 04 NODES -->
          <section id="nodes" v-reveal>
            <h2><span class="num">04</span>Node roles, not a cluster</h2>
            <p class="lede">
              Clustering gives a single web UI but requires quorum: enough nodes online at all times,
              or the survivors go read-only. For a lab where machines are deliberately powered down,
              that is the wrong trade — and removing a node from a cluster later is painful.
            </p>
            <p>
              <strong>Proxmox Datacenter Manager</strong> solves the actual problem — one dashboard
              across independent nodes — without the constraint. It manages remotes purely over the
              API, covering monitoring, start/stop, migration and snapshots, while deep per-node
              configuration stays in that node's own interface.
            </p>

            <h3>Roles follow the binding resource</h3>
            <div class="grid2">
              <div class="card mini">
                <h4 class="mono">Faster CPU + NVMe</h4>
                <p>Takes the latency- and disk-sensitive services: the resolver, the reverse proxy and
                  the manager VM. Its hypervisor boots from a separate SSD, so it can be reinstalled
                  without touching guests and boot I/O never contends with VM I/O.</p>
              </div>
              <div class="card mini">
                <h4 class="mono">Most RAM, slower disk</h4>
                <p>Takes the memory-hungry, disk-tolerant workloads — and doubles as the node that can
                  be broken freely, because nothing depends on it.</p>
              </div>
              <div class="card mini">
                <h4 class="mono">Least RAM → backups</h4>
                <p>Counter-intuitive, and deliberate. Backup Server is the workload <em>least</em>
                  sensitive to RAM: roughly 2 GB for the service plus about 1 GB per TB of datastore.
                  16 GB is four times what it needs.</p>
              </div>
              <div class="card mini">
                <h4 class="mono">Mechanical disks → targets</h4>
                <p>Sequential writes are the one workload spinning disks are genuinely fine at. Two
                  HDD nodes means one holds the datastore and the other takes a periodic sync — two
                  copies on two independent machines.</p>
              </div>
            </div>

            <div class="callout decision">
              <span class="label mono">Why ext4 and not ZFS</span>
              <p>
                The “Backup Server needs lots of RAM” folklore comes from ZFS: its ARC will happily
                consume 8 GB or more. On a single disk with no redundancy, ZFS buys nothing here, so
                the datastore runs on ext4 and the RAM estimate holds. The consequence was worth
                naming: that node stops being expendable, because it has to be up when scheduled jobs
                fire — so the scratch role moved elsewhere.
              </p>
            </div>

            <div class="callout decision">
              <span class="label mono">Design choice · not rebalancing the RAM</span>
              <p>
                Memory is distributed unevenly across the nodes and the arithmetic to even it out
                works. It was left alone. Nothing in the plan is memory-constrained except the node
                that already has the most, so moving capacity to a node running a firewall and a
                container optimises nothing. A rebalance backed by evidence is worth doing; one backed
                by tidiness is not.
              </p>
            </div>
          </section>

          <!-- 05 ROUTER -->
          <section id="router" v-reveal>
            <h2><span class="num">05</span>Taking over the network</h2>
            <p class="lede">
              The lab now runs its own gateway. An OPNsense VM holds the LAN gateway address and
              serves DHCP pointing every client at the lab's resolver — the field the house router's
              firmware never had, and the reason the whole exercise was worth doing.
            </p>

            <h3>A router VM needs two interfaces</h3>
            <p>
              A NIC audit across all five nodes turned up an <strong>Intel I210-T1 server
              adapter sitting unused</strong> in one machine's PCIe slot, never cabled since the day
              it arrived. Transplanted into the node that would host the router, it gave the VM two
              physically separate interfaces at zero cost — WAN on the add-in card, LAN on the
              onboard NIC.
            </p>
            <p>
              The move was confirmed at the hardware level rather than assumed: the card enumerated
              under <code>lspci -nnk</code> with the <code>igb</code> driver bound, initialised
              cleanly in <code>dmesg</code>, and <strong>its MAC address travelled with it</strong> —
              the same address that had been the donor node's unused second interface appeared as the
              recipient's new one. IOMMU groups were checked at the same time, so PCIe passthrough
              stays available as an option later.
            </p>

            <h3>The cutover, and the address that didn't move</h3>
            <div class="layers steps">
              <div class="layer">
                <span class="tier mono">Before</span>
                <span class="body">House router holds the LAN gateway address. No DNS field in its
                  DHCP settings, so clients resolve through the ISP.</span>
              </div>
              <div class="layer arrow">↓</div>
              <div class="layer">
                <span class="tier mono">After</span>
                <span class="body">House router moves to <b>its own WAN subnet</b> and becomes a
                  modem. OPNsense takes the <b>same gateway address the lab always used</b>.</span>
              </div>
              <div class="layer arrow">↓</div>
              <div class="layer">
                <span class="tier mono">Result</span>
                <span class="body"><b>Nothing needed editing.</b> Not a static IP, not a proxy route,
                  not a DNS rewrite, not a backup storage definition. The gateway address didn't
                  move — only what answers on it.</span>
              </div>
            </div>

            <div class="callout decision">
              <span class="label mono">Design choice · sequencing</span>
              <p>
                The cutover was built <strong>last, not first</strong>. The second NIC, the bridge,
                the VM, its firmware and the interface assignment were all in place and verified
                before anything touched the address the lab was reached on — so the one step that
                could sever remote access was taken with a lifeline running and a rollback snapshot
                already taken. Doing it first would have meant configuring a router through the
                network it was breaking.
              </p>
            </div>

            <p>
              One detail that looks arbitrary and isn't: the new WAN subnet deliberately avoids
              OPNsense's own factory-default LAN range. “Reset to factory defaults” is one keystroke
              away on the console menu, and a reset that lands the firewall on the same subnet as the
              upstream router turns a recoverable mistake into a confusing one.
            </p>
            <p>
              Household Wi-Fi was left on the WAN side throughout, unaffected by anything happening in
              the lab. That was the original objection to running a homemade router at all, and it was
              resolved by topology rather than by not building it.
            </p>
          </section>

          <!-- 06 SERVICES -->
          <section id="services" v-reveal>
            <h2><span class="num">06</span>Names &amp; certificates</h2>
            <p class="lede">
              Services are reached by name over trusted HTTPS, with no ports to remember and no
              certificate work when a new one is added.
            </p>

            <div class="layers">
              <div class="layer">
                <span class="tier mono">Resolver</span>
                <span class="body"><b>AdGuard Home</b> in a container, filtering for the whole LAN and
                  forwarding upstream over DoH. The encryption happens on the upstream hop, because the
                  threat being addressed is the ISP reading queries — not the LAN.</span>
              </div>
              <div class="layer">
                <span class="tier mono">Naming</span>
                <span class="body"><b>One wildcard rewrite</b>, not one record per service. Every
                  internal name resolves to the proxy, so adding a service is a proxy edit and nothing
                  else. A per-service record scheme would need a DNS change every time.</span>
              </div>
              <div class="layer">
                <span class="tier mono">Proxy</span>
                <span class="body"><b>Caddy</b> in a container, routing by requested name to the right
                  host and port. Chosen over nginx for automatic certificate handling — the thing that
                  otherwise has to be solved per service, forever.</span>
              </div>
              <div class="layer">
                <span class="tier mono">Certificates</span>
                <span class="body">An <b>internal certificate authority</b> issues for every internal
                  name, with the root installed once on each client. A padlock everywhere, and no
                  public DNS record or inbound exposure to get one.</span>
              </div>
              <div class="layer">
                <span class="tier mono">Remote access</span>
                <span class="body"><b>Tailscale</b> as a subnet router, so the whole lab is reachable
                  from a phone on cellular without opening a single inbound port.</span>
              </div>
            </div>

            <div class="callout">
              <span class="label mono">Known consequence, stated rather than discovered</span>
              <p>
                Concentrating the resolver, the proxy and the certificate authority on one node means
                every internal name in the lab depends on that node being up. That is a real single
                point of failure, and naming it is what makes the second resolver instance a planned
                piece of work rather than an outage waiting to teach the lesson.
              </p>
            </div>
          </section>

          <!-- 07 BACKUPS -->
          <section id="backups" v-reveal>
            <h2><span class="num">07</span>Backups that restore</h2>
            <p class="lede">
              A backup that has never been restored is an assumption. The point of this section is the
              last step, not the first.
            </p>
            <ul>
              <li><strong>Dedicated node.</strong> Backup Server runs as a VM on the node whose disk is
                a mechanical drive, because backups should never live on the machine being backed
                up.</li>
              <li><strong>A scoped token, not root.</strong> Each node authenticates with a token
                holding only datastore rights, rather than the root account. An automation credential
                should be able to do less than the human it belongs to.</li>
              <li><strong>Retention as policy, not per-job.</strong> Prune and garbage collection run
                on the datastore itself on a schedule, so jobs inherit one retention policy rather
                than each carrying its own drifting copy.</li>
              <li><strong>The restore test.</strong> A container was restored to a throwaway ID,
                verified, and destroyed. Six seconds of work that converts the entire backup design
                from theory into fact.</li>
              <li><strong>Verification against bit rot.</strong> The datastore lives on a drive with
                more than 50,000 power-on hours. Scheduled verify jobs are what catch a corrupted
                chunk before a restore needs it.</li>
            </ul>

            <div class="callout decision">
              <span class="label mono">Design choice · attach first, prove immediately</span>
              <p>
                Attaching backup storage to a node and creating a backup job are two separate actions,
                and it is entirely possible to have the first without the second — storage showing
                <em>active</em>, no job configured, nothing ever written. Every job was run once
                manually on creation rather than trusting the schedule to prove itself overnight.
              </p>
            </div>
          </section>

          <!-- 08 HARDWARE -->
          <section id="hardware" v-reveal>
            <h2><span class="num">08</span>Trusting used hardware</h2>
            <p class="lede">
              Five machines arrived with nothing known about them beyond a seller's description. Two
              assumptions in that description turned out to be wrong, and finding out cost nothing
              because it was checked first.
            </p>

            <h3>“Wiped” from a reseller means nothing</h3>
            <p>
              The first machine booted straight into a Windows login screen still carrying its previous
              corporate account — the original install intact, and the disk not even encrypted. Nothing
              was opened and the whole disk was overwritten, but it reset two working assumptions:
              verify what a reseller tells you, and read specifications out of firmware rather than out
              of an operating system that may not be yours to log into.
            </p>

            <h3>Two of five disks were already failing</h3>
            <p>
              Every disk was SMART-audited before anything was committed to it. Same model family,
              same era, wildly different health:
            </p>
            <div class="tablewrap">
              <table class="dtable mono">
                <thead>
                  <tr><th>Power-on hours</th><th>Reallocated</th><th>Pending</th><th>ATA errors</th><th>Verdict</th></tr>
                </thead>
                <tbody>
                  <tr><td>42,241</td><td>0</td><td>0</td><td>0</td><td class="ok">Clean — in service</td></tr>
                  <tr><td>50,250</td><td>0</td><td>0</td><td>0</td><td class="ok">Clean — in service</td></tr>
                  <tr><td>59,364</td><td>0</td><td>0</td><td>0</td><td class="ok">Clean — in service</td></tr>
                  <tr><td>45,850</td><td>136</td><td>16</td><td>36</td><td class="bad">Degrading — retired</td></tr>
                  <tr><td>58,662</td><td>184</td><td>0</td><td>1,229</td><td class="bad">Failing — retired</td></tr>
                </tbody>
              </table>
            </div>
            <p>
              Power-on hours turned out to predict nothing — the highest-hour drive is clean and a
              lower-hour one is the worst of the five. <strong>Reallocated and pending sectors are the
              signal</strong>, and both bad drives were found before they could take data with them
              rather than during a restore.
            </p>
          </section>

          <!-- 09 DIAGNOSIS -->
          <section id="diagnosis" v-reveal>
            <h2><span class="num">09</span>Diagnosis log</h2>
            <p class="lede">
              Twenty-nine problems were logged during the build with their reasoning, not just their
              fixes. Six that generalise beyond this lab:
            </p>

            <h3>A vague UI error, and the specific one underneath it</h3>
            <p>
              The manager could not authenticate to a node. The web interface offered only
              <code>authentication failed</code>. The node's own service journal had the real answer:
            </p>
            <pre><code><span class="c"># on the target node, not the thing showing the error</span>
<span class="k">journalctl</span> -u pvedaemon --since <span class="s">"15 minutes ago"</span> | <span class="k">tail</span> -30

<span class="f">authentication failure; user=root@pam@pam msg=no such user ('root@pam@pam')</span></code></pre>
            <p>
              The realm was being appended twice — typed into the username field <em>and</em> selected
              from the realm dropdown. Worth noting which service logged it: the proxy daemon handles
              the TLS front end and had nothing relevant, while the daemon doing the actual credential
              check had the exact string. <strong>When a management UI gives a vague error, the service
              journal on the target usually has the specific one.</strong>
            </p>

            <h3>A credential with the right permission that could do nothing</h3>
            <p>
              Adding the backup datastore to a node failed with <code>Cannot find datastore … check
              permissions and existence</code> — misleading, because it plainly existed. Running the
              backup client directly gave the real error: a missing permission on the datastore path.
            </p>
            <p>
              The cause is a design property rather than a bug. <strong>A token's effective rights are
              the intersection of its own ACL and its parent user's.</strong> The token had been granted
              datastore rights; the user it belonged to had none. Intersect anything with nothing and
              the result is nothing — and the permission listing looks correct, because it <em>is</em>
              correct, just insufficient alone.
            </p>

            <h3>A NIC that enumerated perfectly and still showed no link</h3>
            <p>
              The transplanted card checked out completely — listed by <code>lspci</code>, driver
              bound, clean initialisation with interrupt vectors and queues. Cable in a switch with
              seven other working ports. And no link, at either end.
            </p>
            <pre><code><span class="c"># the interface was administratively down, and the driver</span>
<span class="c"># powers the PHY down with it — no autonegotiation, no link LED</span>
<span class="k">ip</span> link set enp2s0 up
<span class="c"># → Link detected: yes, Speed: 1000Mb/s</span></code></pre>
            <p>
              A dark switch port <em>feels</em> like decisive physical-layer evidence and it isn't: a
              powered-down PHY looks exactly like a severed cable. The distinguishing test is watching
              the kernel log live while unplugging the cable — a live NIC logs each link event, silence
              means it genuinely can't see the wire. But that only works if the interface is up first,
              which is the same precondition the original symptom violated.
            </p>

            <h3>Two commands that answer different questions</h3>
            <pre><code><span class="k">nslookup</span> service.internal 192.168.x.x   <span class="c"># does the resolver work?</span>
<span class="k">nslookup</span> service.internal                <span class="c"># am I actually using it?</span></code></pre>
            <p>
              The first succeeded, the second didn't. Passing a server explicitly bypasses the system
              configuration entirely, so it will pass on a machine that never sends it a real query.
              The desktop's Wi-Fi adapter had been configured correctly and the <em>Ethernet</em>
              adapter — the live one — had been on the router's DNS for weeks, since an outage when it
              was reverted to DHCP and never switched back.
            </p>
            <p>
              Nothing looked broken because the router also hands out a public filtering resolver, so
              ad blocking kept working the entire time. <strong>The two-layer design did exactly what
              it was built to do, and the fallback was invisible precisely because it worked.</strong>
              Good design, bad observability — and the concrete argument for the lab serving its own
              DHCP rather than configuring DNS device by device.
            </p>

            <h3>An error message specific enough to skip three hypotheses</h3>
            <pre><code><span class="f">From 192.168.x.x icmp_seq=1 Destination Host Unreachable</span></code></pre>
            <p>
              A node wouldn't wake, and the instinct was to suspect a mis-transcribed MAC address. But
              <em>Destination Host Unreachable</em> from the sending host means the ARP request went
              unanswered — the machine isn't on the network at all. That eliminates firewalls, services
              and configuration in one line and points at power or link. The cause was an unseated
              cable; with no link the NIC can't receive a magic packet either, so the wake failure was
              a symptom of the same fault rather than a second problem. A plain timeout would have been
              ambiguous. This wasn't.
            </p>

            <h3>The installer that assigned the interfaces backwards</h3>
            <p>
              The firewall installer's defaults came up with WAN and LAN reversed — the interface
              connected to the upstream router assigned as the internal network and vice versa. Caught
              before the cutover because the assignment was checked against which virtual NIC mapped to
              which bridge, rather than trusted. On the same box the installer never prompted for a
              root password, leaving the appliance on its factory default: two failures in one build
              that only get found by verifying defaults instead of assuming them.
            </p>
          </section>

          <!-- 10 DECISIONS -->
          <section id="decisions" v-reveal>
            <h2><span class="num">10</span>Key decisions, condensed</h2>
            <p class="lede">
              Every choice below traded convenience or tidiness for a property the lab actually needed —
              recoverability, safety, or the freedom to switch a machine off.
            </p>
            <div class="grid2">
              <div class="card mini"><h4 class="mono">Standalone, not clustered</h4><p>A cluster goes read-only without quorum. Nodes here are meant to be powered down. One dashboard over the API gives the benefit without the constraint.</p></div>
              <div class="card mini"><h4 class="mono">Roles follow the resource</h4><p>Fast disk takes latency-sensitive services, most RAM takes the memory-hungry ones, mechanical disks take backups. Not a ranking of the machines.</p></div>
              <div class="card mini"><h4 class="mono">ext4, not ZFS</h4><p>ZFS earns its RAM with redundancy. On a single disk it buys nothing, and the ARC is where the “backups need lots of memory” folklore comes from.</p></div>
              <div class="card mini"><h4 class="mono">Cutover sequenced last</h4><p>Every dependency verified before touching the address the lab is reached on. The one irreversible step ran with a lifeline and a rollback snapshot.</p></div>
              <div class="card mini"><h4 class="mono">One wildcard, not many records</h4><p>Every internal name resolves to the proxy, so a new service is a proxy edit and never a DNS change.</p></div>
              <div class="card mini"><h4 class="mono">Verify before trusting</h4><p>Disks SMART-audited before use, the NIC transplant confirmed by its MAC, backups proven by restoring one. Defaults are checked, not assumed.</p></div>
            </div>
          </section>

          <!-- 11 STACK -->
          <section id="stack" v-reveal>
            <h2><span class="num">11</span>Stack &amp; takeaways</h2>

            <div class="stats">
              <div class="stat"><div class="n mono">5</div><div class="l">standalone nodes, no quorum</div></div>
              <div class="stat"><div class="n mono">29</div><div class="l">problems diagnosed &amp; logged</div></div>
              <div class="stat"><div class="n mono">2<span class="u">/5</span></div><div class="l">disks caught failing before use</div></div>
              <div class="stat"><div class="n mono">0</div><div class="l">addresses changed in the cutover</div></div>
            </div>

            <h3>Full stack</h3>
            <div class="chips">
              <span v-for="t in stack" :key="t" class="chip">{{ t }}</span>
            </div>

            <h3>What I'd carry forward</h3>
            <p>
              The lever wasn't any single service — it was refusing to trust anything that hadn't been
              checked. Disks audited before data went on them, a transplanted card confirmed by its
              hardware address rather than by assumption, an installer's defaults read back instead of
              accepted, and a backup proven by restoring it. Every one of those was cheap at the time
              and would have been expensive later.
            </p>
            <p>
              The second lever was writing down the decisions that went the boring way. Not clustering,
              not rebalancing memory that nothing was waiting on, not buying hardware because buying
              feels like progress. <strong>A change backed by evidence is worth making; one backed by
              tidiness is not</strong> — and a build log is what makes the difference visible six
              months later.
            </p>
          </section>

          <footer class="cs__foot mono">
            <span>Five-Node Proxmox Infrastructure · architecture &amp; operations deep dive</span>
            <span><NuxtLink to="/#project">← portfolio</NuxtLink></span>
          </footer>
        </main>
      </div>
    </div>
  </article>
</template>

<style scoped>
.cs { padding: clamp(20px, 5vh, 40px) 0 60px; }

/* breadcrumb */
.cs__crumb { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.cs__back { font-size: 13px; color: var(--ink-soft); text-decoration: none; }
.cs__back:hover { color: var(--accent); }

/* hero */
.cs__hero { padding: 34px 0 26px; border-bottom: 1px dashed var(--card-border); }
.cs__title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(30px, 6vw, 52px);
  letter-spacing: -0.02em;
  line-height: 1.05;
  margin: 12px 0 14px;
}
.cs__lede { color: var(--ink-soft); max-width: 70ch; font-size: clamp(16px, 2vw, 19px); margin: 0; }
.cs__meta { display: flex; flex-wrap: wrap; gap: 22px 30px; margin-top: 24px; font-size: 12.5px; }
.cs__meta .k { display: block; color: var(--ink-faint); margin-bottom: 3px; }
.cs__meta .v { color: var(--ink); }

/* layout w/ sticky TOC */
.cs__layout { display: grid; grid-template-columns: 228px 1fr; gap: 48px; }
.cs__tocwrap {
  position: sticky; top: 84px; align-self: start;
  max-height: calc(100vh - 100px);
  overflow-y: auto; overflow-x: hidden;
  padding-top: 38px; padding-right: 8px;
}
.cs__toctitle { font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--ink-faint); margin: 0 0 12px; }
/* Courier sits lighter than the serif list beneath it, so paper needs more
   weight here to read as a heading rather than a caption. */
:root[data-theme='paper'] .cs__toctitle {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--ink-soft);
  margin-bottom: 14px;
}
.cs__toc { list-style: none; margin: 0; padding: 0; counter-reset: toc; }
.cs__toc a {
  display: block; padding: 6px 0 6px 28px; position: relative;
  font-size: 13px; color: var(--ink-soft); border-left: 1px solid var(--card-border); line-height: 1.4;
  text-decoration: none;
  border-radius: 0 4px 4px 0;
  transition: transform .22s cubic-bezier(.22, 1, .36, 1), color .2s ease,
    border-color .2s ease, background-color .2s ease;
}
.cs__toc a::before {
  counter-increment: toc; content: counter(toc, decimal-leading-zero);
  position: absolute; left: 6px; top: 8px; font-family: var(--font-mono); font-size: 10px; color: var(--ink-faint);
}
.cs__toc a:hover { color: var(--ink); border-left-color: var(--accent); }

/* the section the reader is currently in — nudged out of the rail and tinted */
.cs__toc a.is-active {
  color: var(--ink);
  border-left-color: var(--accent);
  background-color: color-mix(in srgb, var(--accent) 12%, transparent);
  transform: translateX(6px);
}
.cs__toc a.is-active::before { color: var(--accent); }

@media (prefers-reduced-motion: reduce) {
  /* keep the offset, drop the travel */
  .cs__toc a { transition: none; }
}

/* body sections */
.cs__body { min-width: 0; padding-top: 8px; }
.cs__body section { padding: 36px 0; border-bottom: 1px dashed var(--card-border); scroll-margin-top: 80px; }
.cs__body section:last-of-type { border-bottom: none; }
.cs__body h2 {
  font-family: var(--font-display);
  font-size: clamp(21px, 3vw, 26px);
  font-weight: 700;
  letter-spacing: -0.01em;
  margin: 0 0 8px;
}
.cs__body h2 .num { font-family: var(--font-mono); font-size: 14px; color: var(--accent-2); margin-right: 12px; }
.cs__body h3 { font-family: var(--font-display); font-size: 16.5px; margin: 26px 0 8px; }
.cs__body .lede { color: var(--ink-soft); font-size: 15.5px; max-width: 70ch; margin: 4px 0 16px; }
.cs__body p { max-width: 72ch; color: var(--ink); font-size: 15px; }
.cs__body ul { padding-left: 22px; color: var(--ink-soft); }
.cs__body li { margin: 7px 0; font-size: 15px; }
.cs__body strong { color: var(--ink); font-weight: 650; }
.cs__body em { color: var(--ink); }

/* screenshot gallery */
.shots { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; margin: 22px 0 14px; }
.shot { margin: 0; }
.shot__frame {
  display: block; border: 1px solid var(--card-border); border-radius: 10px; overflow: hidden;
  background: var(--card); line-height: 0; transition: border-color .15s ease, transform .15s ease;
}
.shot__frame:hover { border-color: var(--accent); transform: translateY(-2px); }
.shot__frame img { width: 100%; height: auto; display: block; }
.shot figcaption { font-size: 13px; color: var(--ink-soft); margin-top: 9px; line-height: 1.45; }
.shot figcaption .fig { display: block; font-size: 10.5px; letter-spacing: 1px; text-transform: uppercase; color: var(--accent-2); margin-bottom: 3px; }
.shots__note { font-size: 11.5px; color: var(--ink-faint); margin: 4px 0 0; }
@media (max-width: 640px) { .shots { grid-template-columns: 1fr; } }

/* mini card grid */
.grid2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; margin: 18px 0; }
.mini { padding: 14px 16px; }
.mini h4 { margin: 0 0 8px; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; color: var(--ink-faint); }
.mini p { margin: 0; font-size: 14px; color: var(--ink-soft); max-width: none; }

/* callouts */
.callout {
  border: 1px solid var(--card-border);
  border-left: 3px solid var(--accent-2);
  background: color-mix(in srgb, var(--accent-2) 7%, transparent);
  border-radius: 6px; padding: 14px 18px; margin: 20px 0;
}
.callout .label { font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: var(--accent-2); display: block; margin-bottom: 4px; }
.callout p { margin: 4px 0; font-size: 14.5px; color: var(--ink-soft); }
.callout.decision { border-left-color: var(--accent); background: color-mix(in srgb, var(--accent) 8%, transparent); }
.callout.decision .label { color: var(--accent); }

/* layered diagram */
.layers { margin: 22px 0; display: grid; gap: 10px; }
.layer {
  display: grid; grid-template-columns: 150px 1fr; gap: 16px; align-items: center;
  border: 1px solid var(--card-border); border-radius: 8px; padding: 13px 16px; background: var(--card);
}
.layer .tier { font-size: 11.5px; color: var(--accent); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
.layer .body { font-size: 13.5px; color: var(--ink-soft); }
.layer .body b { color: var(--ink); }
.layer.arrow { grid-template-columns: 1fr; text-align: center; border: none; background: none; padding: 0; color: var(--ink-faint); font-family: var(--font-mono); }
.layers.steps .layer { grid-template-columns: 130px 1fr; }

/* SMART table */
.tablewrap { overflow-x: auto; margin: 18px 0; }
.dtable { border-collapse: collapse; width: 100%; font-size: 13px; min-width: 520px; }
.dtable th, .dtable td { text-align: left; padding: 9px 12px; border-bottom: 1px solid var(--card-border); white-space: nowrap; }
.dtable th { color: var(--ink-faint); font-weight: 500; font-size: 11px; letter-spacing: 0.8px; text-transform: uppercase; }
.dtable td { color: var(--ink-soft); }
.dtable td.ok { color: var(--accent-3); }
.dtable td.bad { color: var(--accent-2); }

/* code blocks — token-based so they read correctly on every theme */
.cs__body pre {
  background: color-mix(in srgb, var(--ink) 5%, var(--paper));
  border: 1px solid var(--card-border);
  border-radius: 8px; padding: 16px 18px; overflow-x: auto; margin: 18px 0;
}
.cs__body pre code {
  font-family: var(--font-mono); font-size: 12.6px; line-height: 1.6;
  color: var(--ink); background: none; border: none; padding: 0;
}
.cs__body pre .c { color: var(--ink-faint); }
.cs__body pre .k { color: var(--accent); }
.cs__body pre .s { color: var(--accent-3); }
.cs__body pre .f { color: var(--accent-2); }
/* inline code */
.cs__body :not(pre) > code {
  font-family: var(--font-mono); font-size: 0.85em;
  background: color-mix(in srgb, var(--accent) 10%, transparent);
  border: 1px solid var(--card-border); border-radius: 4px; padding: 1px 5px; color: var(--ink);
}

/* stats */
.stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 24px 0 8px; }
.stat { border: 1px solid var(--card-border); border-radius: 8px; padding: 16px; background: var(--card); }
.stat .n { font-size: 26px; font-weight: 700; color: var(--ink); }
.stat .n .u { font-size: 15px; color: var(--accent-2); }
.stat .l { font-size: 12.5px; color: var(--ink-soft); margin-top: 2px; }

.chips { display: flex; flex-wrap: wrap; gap: 8px; margin: 12px 0; }

/* footer */
.cs__foot {
  display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px;
  border-top: 1px dashed var(--card-border); padding: 24px 0 0; margin-top: 8px;
  font-size: 12.5px; color: var(--ink-faint);
}
.cs__foot a { color: var(--ink-soft); text-decoration: none; }
.cs__foot a:hover { color: var(--accent); }

@media (max-width: 880px) {
  .cs__layout { grid-template-columns: 1fr; gap: 0; }
  .cs__tocwrap { display: none; }
  .grid2, .stats { grid-template-columns: 1fr; }
  .stats { grid-template-columns: repeat(2, 1fr); }
  .layer { grid-template-columns: 1fr; gap: 6px; }
  .layers.steps .layer { grid-template-columns: 1fr; }
}
</style>
