// Single source of truth for portfolio content.

export const profile = {
  name: 'Mohaimmen Bajwa',
  role: 'Full-Stack Web Developer',
  // Roles the hero "wheel" cycles through (typed one at a time). The first one
  // doubles as the canonical `role` above for the spec sheet.
  roles: [
    'Full-Stack Web Developer',
    'AI Engineer',
    'Cloud & Backend Engineer',
    'Vue & Nuxt Specialist'
  ],
  location: 'Richmond Hill, Ontario',
  email: 'mohaimmenbajwa2002@gmail.com',
  phone: '(647) 969-2300',
  github: 'https://github.com/depressedsauce',
  resume: '/Mohaimmen-Bajwa-Resume.pdf',
  tagline:
    'I build and run production software end-to-end — from Postgres and cloud infrastructure to polished Vue/Nuxt interfaces — and I’m now bringing AI into that stack.',
  summary:
    'Full-stack web developer with 6+ years of production experience shipping client websites, now focused on Vue/Nuxt + Postgres applications. I design and run a multi-tenant SaaS platform covering authentication, payments, scheduling, document ingestion, and a Capacitor-based Android tracker — all on a single Nuxt 4 codebase backed by Supabase Postgres with row-level security.'
}

export const stats = [
  { value: '6+', label: 'years shipping for clients' },
  { value: '2', label: 'live production platforms' },
  { value: '10+', label: 'integrated services orchestrated' },
  { value: '3', label: 'layers of access control' }
]

export interface Skill {
  name: string
  use: string // short "how I used it" note shown on hover
  key?: boolean // standout skill — highlighted in the grid
}
export const skills: { group: string; items: Skill[] }[] = [
  {
    group: 'Frontend',
    items: [
      { name: 'Vue 3 (Composition API)', use: 'Built 40+ reusable components and composables across the dashboards.' },
      { name: 'Nuxt 4', use: 'The whole platform — pages, SSR, and server routes — runs on one Nuxt 4 app.' },
      { name: 'TypeScript', use: 'End-to-end types shared across the frontend, server routes, and data layer.' },
      { name: 'Tailwind CSS v4', use: 'Token-based theming so each role’s dashboard has its own consistent look.' },
      { name: 'Nuxt UI', use: 'Accessible base components for forms, modals, and data tables.' },
      { name: 'Vite', use: 'Fast HMR in dev and optimized, code-split bundles in production.' },
      { name: 'PWA (Workbox)', use: 'Offline shell and install prompts via @vite-pwa/nuxt.' },
      { name: 'Service Workers', use: 'Cache the app shell and assets so dashboards load offline.', key: true },
      { name: 'IndexedDB', use: 'Pending-queue for GPS fixes so no lesson route is lost on a crash.', key: true },
      { name: 'Geolocation API', use: 'watchPosition powers live trip tracking in the browser runtime.' },
      { name: 'Wake Lock API', use: 'Keeps the screen awake while an instructor records a route.' },
      { name: 'SSR / hybrid rendering', use: 'Server-render marketing pages for SEO; hydrate dashboards behind auth.' }
    ]
  },
  {
    group: 'Backend',
    items: [
      { name: 'Nitro server routes', use: 'Every API — auth, payments, document ingest — is a Nitro server route.' },
      { name: 'Node.js', use: 'Server runtime for APIs, cron jobs, and the IMAP poller.' },
      { name: 'REST APIs', use: 'Designed the platform’s REST endpoints with role-based guards.' },
      { name: 'Cron jobs', use: 'Schedule the inbound-email poller and routine maintenance tasks.' },
      { name: 'Webhooks', use: 'Handle Resend Inbound and Moneris callbacks as server webhooks.' },
      { name: 'Server middleware', use: 'Adds security headers and CSRF before every request.' },
      { name: 'PL/pgSQL functions & triggers', use: 'Audit-ledger trigger mirrors every transaction into a tamper-evident table.', key: true },
      { name: 'Realtime / WebSockets', use: 'Stream live trip playback and notifications to clients.', key: true },
      { name: 'PDF extraction (unpdf)', use: 'Pull text from forwarded receipts and certificates for ingest.' },
      { name: 'Email parsing (mailparser)', use: 'Normalise inbound emails into one shape for the pipeline.' },
      { name: 'Image processing (sharp)', use: 'Resize and compress avatars and uploaded documents.' },
      { name: 'Idempotency keys', use: 'Stop double-clicks and retries from recording a payment twice.' },
      { name: 'CSV export', use: 'Admin data exports for reporting and bookkeeping.' }
    ]
  },
  {
    group: 'Database',
    items: [
      { name: 'Postgres', use: 'Primary datastore — schema, triggers, indexes, and JSONB columns.' },
      { name: 'Supabase', use: 'Managed Postgres + Auth + Storage + Realtime backing the platform.' },
      { name: 'Row-Level Security', use: 'Per-role RLS policies so the database itself enforces access.' },
      { name: 'JWT custom claims', use: 'A claims hook injects the user’s role into every token for RLS.' },
      { name: 'SQL migrations', use: '60+ versioned migrations run through the Supabase CLI workflow.' },
      { name: 'Postgres triggers', use: 'Immutable audit trail and derived-balance maintenance.', key: true },
      { name: 'Supabase Storage', use: 'Holds avatars and student documents with scoped access.', key: true },
      { name: 'Supabase Realtime', use: 'Publications and channels drive live trip and notification streams.', key: true },
      { name: 'GRANT / least-privilege', use: 'Revoke anon/authenticated on admin-only tables beyond RLS.' },
      { name: 'node-postgres (pg)', use: 'Direct Postgres access for scripts and migration tooling.' },
      { name: 'Schema design', use: 'Modelled enrolments, ledgers, documents, and lesson data.' },
      { name: 'MySQL', use: 'Data management during my early work at Lynx ERP Solutions.' }
    ]
  },
  {
    group: 'Auth & Security',
    items: [
      { name: 'Supabase Auth', use: 'Sign-up, login, sessions, and password reset for all roles.' },
      { name: 'CSP + nonce', use: 'Per-request nonce CSP emitted by nuxt-security.' },
      { name: 'strict-dynamic', use: 'Only scripts the app loads can execute, even if markup is injected.', key: true },
      { name: 'CSRF', use: 'Custom double-submit CSRF on every mutating request.' },
      { name: 'Rate-limiting', use: 'IP + session limits on public and auth endpoints.' },
      { name: 'reCAPTCHA v3', use: 'Server-verified bot scoring on public forms.' },
      { name: 'Role-based access', use: 'Student / parent / instructor / admin enforced in three layers.' },
      { name: 'HSTS / security headers', use: 'HSTS preload, nosniff, framing, and Permissions-Policy locked down.' },
      { name: 'Honeypot + dwell-time', use: 'Catch bots that fill hidden fields or submit suspiciously fast.', key: true },
      { name: 'IDOR prevention', use: 'Ownership checks so an ID can’t be guessed to reach another account.', key: true },
      { name: 'Account lifecycle / soft-delete', use: 'Archived/deleted accounts are rejected even with a valid token.' },
      { name: 'Least-privilege credentials', use: 'Scoped, non-root tokens for automation — a token can never exceed its user.', key: true },
      { name: 'Network segmentation', use: 'Lab behind its own firewall; the household stays upstream of it, unaffected.' },
      { name: 'Internal PKI', use: 'Ran a private certificate authority so internal services get real TLS.' },
      { name: 'DNS filtering', use: 'Network-level blocking as a layer that covers devices I don’t administer.' },
      { name: 'Secure Boot / UEFI', use: 'Nodes and guests boot with Secure Boot rather than in legacy BIOS mode.' },
      { name: 'Credential hygiene', use: 'Cleared inherited BIOS passwords; rotate any secret that touches a screenshot.' }
    ]
  },
  {
    group: 'Integrations',
    items: [
      { name: 'Moneris Checkout', use: 'Hosted Checkout with server-to-server verify and an audit ledger.' },
      { name: 'Resend', use: 'Transactional email for verification, receipts, and notifications.' },
      { name: 'Resend Inbound', use: 'Webhook transport that feeds the document-ingest pipeline.', key: true },
      { name: 'IMAP (imapflow)', use: 'Polls a mailbox to ingest forwarded registrations and receipts.' },
      { name: 'Leaflet', use: 'Live trip map with animated polyline playback over Realtime.' },
      { name: 'OpenStreetMap / CARTO', use: 'Basemap tiles for the trip map, with OSM as fallback.' },
      { name: 'Interac e-Transfer', use: 'Claim and reconciliation workflow for non-card payments.' }
    ]
  },
  {
    group: 'Mobile / Native',
    items: [
      { name: 'Capacitor 6', use: 'Wraps the same Nuxt app as an Android GPS lesson tracker.' },
      { name: 'Android', use: 'Shipped the single codebase as an installable Android APK.', key: true },
      { name: 'Java', use: 'Native glue for the Android foreground-service integration.' },
      { name: 'Gradle', use: 'Android build configuration and dependency management.' },
      { name: 'Foreground service', use: 'Keeps GPS tracking alive with the screen off in a moving car.', key: true },
      { name: 'Background geolocation', use: '@capacitor-community/background-geolocation for field recording.' },
      { name: 'Offline-first sync', use: 'Buffer fixes locally and replay them once the network returns.' }
    ]
  },
  {
    group: 'DevOps / Quality',
    items: [
      { name: 'Git', use: 'Version control for everything I ship.' },
      { name: 'Supabase CLI', use: 'Runs migrations and the local Postgres stack for safe changes.' },
      { name: 'Docker', use: 'Runs the local Supabase stack for sandboxed development.', key: true },
      { name: 'Playwright (E2E)', use: 'Regression harness covering auth, role gating, and payments.', key: true },
      { name: 'ESLint', use: 'Enforces consistent style and catches issues before commit.' },
      { name: 'Sandbox / prod env switching', use: 'One command flips between local sandbox and cloud, with guard rails.' },
      { name: 'SEO (Schema.org · Sitemaps · OG)', use: 'Structured data, sitemaps, and social cards for the public site.' },
      { name: 'WebP optimization', use: 'Compressed, responsive images for fast page loads.' },
      { name: 'Self-hosting', use: 'Run the services I depend on — DNS, proxy, backups — on hardware I own.', key: true },
      { name: 'Disaster recovery', use: 'Restore drills, and rollback snapshots taken before irreversible changes.' },
      { name: 'Runbook documentation', use: 'A build log recording 29 diagnosed problems with the reasoning, not just the fix.', key: true },
      { name: 'Root-cause diagnosis', use: 'Read the error that names the failing layer before changing anything.' },
      { name: 'Capacity planning', use: 'Match workloads to the resource that actually binds them, and leave the rest alone.' }
    ]
  },
  {
    group: 'Virtualisation',
    items: [
      { name: 'Proxmox VE', use: 'Five hypervisor nodes running every VM and container in the homelab.', key: true },
      { name: 'KVM / QEMU', use: 'Full VMs for the router, the backup server and the management plane.' },
      { name: 'LXC containers', use: 'Lightweight guests for the resolver and the reverse proxy.' },
      { name: 'Datacenter Manager', use: 'One dashboard across standalone nodes over the API — no cluster quorum.', key: true },
      { name: 'Snapshots & rollback', use: 'Pre/post snapshots around the router cutover, taken with the guest agent live.' },
      { name: 'virtio / q35 / UEFI', use: 'Paravirtualised NICs and disks on a modern machine type with Secure Boot.' },
      { name: 'IOMMU / PCIe passthrough', use: 'Verified VT-d groups so the NICs can be passed through directly if needed.' },
      { name: 'Guest boot ordering', use: 'Start-at-boot and start order so the router comes up before what depends on it.' },
      { name: 'Storage layout (LVM-thin)', use: 'Hypervisor on its own disk, guests on a separate NVMe thinpool.' }
    ]
  },
  {
    group: 'Networking & Firewall',
    items: [
      { name: 'OPNsense', use: 'Router VM holding the LAN gateway, replacing the ISP box as the edge.', key: true },
      { name: 'WAN / LAN separation', use: 'Two physically separate NICs rather than one trunked interface.', key: true },
      { name: 'Linux bridging (vmbr)', use: 'Bridges mapping each physical NIC to the right virtual interface.' },
      { name: 'Subnetting & static addressing', use: 'A node and service address plan kept clear of every DHCP pool.' },
      { name: 'Kea DHCP', use: 'Serves the lab, handing out the gateway and the lab’s own resolver.' },
      { name: 'DNS (AdGuard Home)', use: 'Filtering resolver for the whole LAN, forwarding upstream over DoH.' },
      { name: 'DNS-over-HTTPS', use: 'Encrypts the upstream hop, where the ISP would otherwise read every query.' },
      { name: 'Caddy reverse proxy', use: 'Routes every service by name, so nothing is reached by host and port.' },
      { name: 'Internal CA / TLS', use: 'Issues certificates for internal names — trusted HTTPS with no public DNS.', key: true },
      { name: 'Tailscale', use: 'Subnet router giving remote access to the lab without an inbound port.' },
      { name: 'Wake-on-LAN', use: 'Nodes sleep by default and wake on demand, verified end to end.' },
      { name: 'Network cutover planning', use: 'Sequenced the gateway swap so no address, route or rewrite had to change.', key: true }
    ]
  },
  {
    group: 'Backup & Recovery',
    items: [
      { name: 'Proxmox Backup Server', use: 'Deduplicating datastore on a dedicated node, off the machines it protects.', key: true },
      { name: 'Restore testing', use: 'Restored a container to a throwaway ID and verified it — a backup, not an assumption.', key: true },
      { name: 'Prune & garbage collection', use: 'Retention held as datastore policy, so individual jobs cannot drift apart.' },
      { name: 'Verify jobs / bit rot', use: 'Scheduled verification catches a corrupt chunk before a restore needs it.' },
      { name: 'Scoped API tokens', use: 'Nodes authenticate with datastore-only rights instead of root.', key: true },
      { name: 'Off-node copies', use: 'Backups target a different physical machine from the one being backed up.' },
      { name: 'Config-level backups', use: 'Firewall configuration exported separately as the fast recovery path.' }
    ]
  },
  {
    group: 'Linux & Systems',
    items: [
      { name: 'Debian', use: 'Every node, VM and container in the lab, built and administered from the shell.' },
      { name: 'Bash', use: 'Node administration, diagnostics, and the wake-on-LAN tooling.' },
      { name: 'systemd / journalctl', use: 'Where the specific error lives when a web UI only offers a vague one.', key: true },
      { name: 'apt / deb822 repos', use: 'Signed-By keyrings and archive keys — fixed a repo failing its signature check.' },
      { name: 'SMART / smartctl', use: 'Audited five disks before use; two were degrading and were retired.', key: true },
      { name: 'ethtool', use: 'One-shot check for link speed, duplex, and wake-on-LAN arming.' },
      { name: 'lspci / dmesg', use: 'Confirmed a transplanted NIC by driver binding and its MAC, not by assumption.' },
      { name: 'ip / iproute2', use: 'Interface state, addressing, and bridges applied without dropping the session.' },
      { name: 'BIOS / firmware flashing', use: 'Brought five machines to a common firmware baseline with no OS installed.' },
      { name: 'Hardware diagnostics', use: 'Traced dead boards, wrong-voltage RAM, and unseated cables to root cause.' }
    ]
  },
  {
    group: 'Tooling & WordPress',
    items: [
      { name: 'Elementor', use: 'Built the original Driving Headquarters WordPress site.' },
      { name: 'Divi', use: 'Designed Tamil Heritage Month end-to-end in the Divi builder.' },
      { name: 'WP Rocket', use: 'Caching + CDN for WordPress performance tuning.' },
      { name: 'Wordfence', use: 'Security hardening and login lockdown on WordPress sites.' },
      { name: 'UpdraftPlus', use: 'Scheduled backups and restores for WordPress clients.' },
      { name: 'All-in-One SEO', use: 'On-page SEO, sitemaps, and meta management in WordPress.' }
    ]
  }
]

/* ============================================================
   PROJECTS
   Each project gets a /projects/<slug> detail page.
   To expand a project: add paragraphs to `overview`, items to
   `highlights` / `challenges`, and real images by dropping files
   in /public/shots/ and setting each gallery item's `src`.
   ============================================================ */

export interface ProjectBlock {
  h: string
  p: string
}
export interface Shot {
  fig: string
  src: string
  caption: string
}
export interface Project {
  slug: string
  name: string
  tagline: string // short summary (used on cards + featured section)
  role: string
  period: string
  status: string
  liveUrl?: string
  repoUrl?: string
  featured?: boolean
  tags: string[]
  overview: string[] // detail-page intro paragraphs
  highlights: ProjectBlock[]
  challenges?: ProjectBlock[]
  gallery: Shot[]
}

export const projects: Project[] = [
  {
    slug: 'driving-headquarters',
    name: 'Driving Headquarters Platform',
    tagline:
      'A single-codebase web + mobile platform: public marketing site, four authenticated dashboards (student, parent, instructor, admin), a payments + financial-ledger system, an email-driven document-ingest pipeline, and a live GPS lesson tracker.',
    role: 'Sole Developer',
    period: '2022 — Present',
    status: 'Live in production',
    liveUrl: 'https://drivingheadquarters.ca/',
    featured: true,
    tags: [
      'Nuxt 4',
      'Vue 3',
      'TypeScript',
      'Supabase (Postgres + Auth + Storage + Realtime)',
      'Tailwind v4',
      'Nitro',
      'Moneris',
      'Resend',
      'Capacitor 6',
      'Leaflet'
    ],
    overview: [
      'Driving Headquarters is a multi-location driving school in the Greater Toronto Area. I have been its sole developer since 2019 — originally on WordPress + Elementor, then I designed and built a full custom platform as the business outgrew off-the-shelf plugins.',
      'The result is a single Nuxt 4 codebase that serves the public marketing site, four role-based dashboards (student, parent, instructor, admin), a payments and financial-ledger system, an email-driven document-ingest pipeline, and a Capacitor-wrapped Android app with live GPS tracking — all backed by Supabase Postgres with row-level security and zero self-hosted servers.',
      'I own every layer: schema design and migrations, server APIs, the entire frontend and design system, security headers, payments integration, the mobile build, backups, and incident response.'
    ],
    highlights: [
      {
        h: 'Three-layer authorization',
        p: 'Role-based access enforced in client route middleware, server requireAuth/requireRole guards, and Postgres RLS policies driven by a JWT custom-claims hook — a leaked service key still cannot bypass it.'
      },
      {
        h: 'Cloud payments pipeline',
        p: 'Moneris Hosted Checkout with server-to-server verify, an immutable transaction audit trigger, payment-plan modelling, and an e-Transfer claim/reconciliation workflow.'
      },
      {
        h: 'Document-ingest pipeline',
        p: 'Forwarded emails (BDE receipts, MTO certificates, driver licences) auto-route to the right student via per-kind extractors, content-fingerprint dedup, and a fuzzy student matcher.'
      },
      {
        h: 'Live GPS trip tracker',
        p: 'Capacitor background-geolocation as an Android foreground service with offline buffering, played back on a Leaflet map over Supabase Realtime.'
      },
      {
        h: 'Hardened public surface',
        p: 'nuxt-security CSP (per-request nonce, strict-dynamic), custom CSRF middleware, IP+session rate limiting, reCAPTCHA v3, honeypot, and dwell-time bot defence.'
      },
      {
        h: 'Safe database operations',
        p: '60+ versioned SQL migrations via the Supabase CLI workflow, a sandboxed local Postgres, and a Playwright QA harness that runs a full regression pass before any deploy.'
      }
    ],
    challenges: [
      {
        h: 'Migrating a live business off WordPress',
        p: 'Re-platformed an active marketing site into a custom app without downtime or losing SEO — keeping the public pages fast while layering the LMS on top.'
      },
      {
        h: 'Trusting the database, not the client',
        p: 'Designed authorization so the source of truth is Postgres RLS. Even if a server bug or a leaked key slips through, the database itself refuses to return another user’s rows.'
      }
    ],
    gallery: [
      { fig: 'fig. 01', src: '/shots/dhq/student-console.png', caption: 'Student console — the gamified “driver dossier” dashboard' },
      { fig: 'fig. 02', src: '/shots/dhq/admin-dashboard.png', caption: 'Admin dashboard — revenue, balances & what needs attention' },
      { fig: 'fig. 03', src: '/shots/dhq/admin-email-intake.png', caption: 'Email intake — the human-reviewed document-ingest queue' },
      { fig: 'fig. 04', src: '/shots/dhq/admin-registrations.png', caption: 'Registrations — public-site leads triaged to enrolment (PII redacted)' },
      { fig: 'fig. 05', src: '/shots/dhq/admin-analytics.png', caption: 'Analytics — period KPIs and lifetime metrics' },
      { fig: 'fig. 06', src: '/shots/dhq/student-field-guide.png', caption: 'Student console, themed — the dashboard is fully themeable' }
    ]
  },
  {
    slug: 'homelab',
    name: 'Five-Node Proxmox Infrastructure',
    tagline:
      'Five standalone Proxmox nodes that route, resolve, proxy and back up their own network — built on used office hardware and documented decision by decision.',
    role: 'Architect & operator',
    period: '2026 — Present',
    status: 'Live · self-hosted',
    tags: [
      'Proxmox VE',
      'OPNsense',
      'Linux',
      'Networking',
      'DNS',
      'Backup & recovery',
      'Caddy',
      'Tailscale'
    ],
    overview: [
      'Five used Dell OptiPlex machines running Proxmox VE as independent hypervisors, aggregated into one view through Proxmox Datacenter Manager. Deliberately not a cluster: clustering buys a single UI but demands quorum, and quorum conflicts with powering nodes down — to experiment, and to keep a bedroom at a liveable temperature.',
      'The lab now runs the network it sits on. An OPNsense VM holds the LAN gateway address and serves DHCP pointing at the lab’s own resolver — which is what the whole build was for. The ISP router’s firmware had no field to hand out a DNS server, so clients silently bypassed filtering for weeks before it was caught. That failure mode is now structurally impossible.'
    ],
    highlights: [
      {
        h: 'The lab routes itself',
        p: 'An OPNsense VM on a node with two physically separate NICs took over as the LAN gateway; the ISP router moved to its own WAN subnet and became a modem. The cutover ran with zero packet loss on the management link, and household Wi-Fi was never touched.'
      },
      {
        h: 'Names and certificates, not ports',
        p: 'AdGuard Home filters over DoH, and one wildcard rewrite points every internal name at a Caddy reverse proxy. An internal CA issues the certificates, so services are reachable by name over trusted HTTPS with no per-service certificate work.'
      },
      {
        h: 'Backups that were restored, not assumed',
        p: 'Proxmox Backup Server on a dedicated node, reached through a scoped API token rather than root, with prune and garbage-collection schedules. A container was restored to a throwaway ID and verified — the step that turns a backup job into a backup.'
      },
      {
        h: 'Hardware verified before it was trusted',
        p: 'Every disk SMART-audited before anything was committed to it. Two of five were degrading — one with 1,229 ATA errors — and both were retired before they could take data with them. The machines were also sold as wiped and were not.'
      }
    ],
    challenges: [
      {
        h: 'Standalone nodes over a cluster',
        p: 'A cluster gives one dashboard but goes read-only when it loses quorum. In a lab where machines are switched off on purpose, that is the wrong trade — and removing a node from a cluster later is painful. Proxmox Datacenter Manager provides the single view over the API with no quorum constraint.'
      },
      {
        h: 'Getting a wire between two floors',
        p: 'The longest blocker in the build, and none of it technical. Moving the router died on fibre — the ONT is fixed where the installer drilled. MoCA was the elegant answer until the “coax jack” turned out to be an RJ11 phone jack. Wireless bridging is ruled out by the 802.11 spec itself, which will not let a client relay frames for other MAC addresses. The answer was 150 ft of flat Cat6 for $36.'
      },
      {
        h: 'Sequencing so a mistake could not strand the lab',
        p: 'The router cutover was built last, not first. The second NIC, the bridge, the VM, its firmware and the interface assignment were all in place and verified before anything touched the address the lab was reached on — so the one step that could sever remote access was taken with a lifeline running.'
      },
      {
        h: 'Choosing not to do the satisfying thing',
        p: 'RAM sits unevenly across the nodes and the arithmetic to balance it works. It was left alone: nothing is memory-constrained except the node that already has the most, so the change would optimise nothing. A rebalance backed by evidence is worth doing; one backed by tidiness is not.'
      }
    ],
    gallery: [
      { fig: 'fig. 01', src: '/shots/homelab/datacenter-manager.png', caption: 'Datacenter Manager — five standalone nodes and every guest in one view, without a cluster' },
      { fig: 'fig. 02', src: '/shots/homelab/opnsense.png', caption: 'OPNsense — the lab’s own gateway, WAN and LAN on physically separate interfaces (gateway address and version detail redacted)' },
      { fig: 'fig. 03', src: '/shots/homelab/backup-server.png', caption: 'Backup Server — a 290 GB datastore, with the router and manager VMs backing up nightly' },
      { fig: 'fig. 04', src: '/shots/homelab/adguard.png', caption: 'AdGuard Home — 13,316 queries in 24 hours, 21% blocked, 10 ms average response' },
      { fig: 'fig. 05', src: '/shots/homelab/proxmox-node.png', caption: 'pve1 — DNS, reverse proxy and the manager VM, with guest storage on its own NVMe pool' }
    ]
  },
  {
    slug: 'tamil-heritage-month',
    name: 'Tamil Heritage Month',
    tagline:
      'A content-driven heritage website built end-to-end in the Divi theme builder, including a full hosting + domain migration.',
    role: 'Web Developer',
    period: 'Dec 2022 — 2025',
    status: 'Live · maintained',
    liveUrl: 'https://tamilheritagemonth.com/',
    tags: ['WordPress', 'Divi Builder', 'DNS / Nameservers', 'Hosting migration', 'Responsive design'],
    overview: [
      'Tamil Heritage Month is a community organization celebrating Tamil culture each January. I designed and built the site end-to-end in the Divi theme builder, with custom page layouts and brand styling.',
      'Partway through the engagement the site needed to move to a new hosting provider. I handled the full migration: DNS and nameserver changes, a fresh WordPress install, content restore, and post-cutover troubleshooting — with no loss of content.'
    ],
    highlights: [
      {
        h: 'Designed entirely in Divi',
        p: 'Custom layouts, brand colours, and responsive sections built with the Divi theme builder for a content-heavy, editor-friendly site.'
      },
      {
        h: 'End-to-end hosting migration',
        p: 'Moved the domain to a new provider — DNS, nameservers, fresh install, content restore, and SSL — and resolved the issues that came up during cutover.'
      }
    ],
    gallery: [
      { fig: 'fig. 01', src: '/shots/thm/home-hero.png', caption: 'Home page — bilingual hero over the year’s commissioned artwork, with the council seal' },
      { fig: 'fig. 02', src: '/shots/thm/events.png', caption: 'Events section — the January programme as an expandable Divi listing' }
    ]
  },
  {
    slug: '7th-pixel-qa',
    name: 'Lynx ERP Solutions — QA Tester',
    tagline:
      'Ongoing QA role: testing client websites, giving structured feedback, and recording and fixing the issues that turn up.',
    role: 'QA Tester',
    period: '2020 — Present',
    status: 'Ongoing',
    liveUrl: 'https://lynxerp.ca/',
    tags: ['QA', 'Manual testing', 'Bug tracking', 'Cross-browser', 'UX feedback'],
    overview: [
      'Alongside my earlier internship, I do ongoing QA work for Lynx ERP Solutions. My focus is making sure client websites actually behave the way they should — before and after they ship.',
      'Day to day that means testing sites across browsers and devices, writing up the defects and UX problems I find with clear reproduction steps, feeding that back to the development team, and then recording and helping fix each issue through to a verified resolution.'
    ],
    highlights: [
      {
        h: 'Testing',
        p: 'Exercise client sites across browsers and devices to surface functional and UX issues before users hit them.'
      },
      {
        h: 'Feedback',
        p: 'Document findings with clear, reproducible steps and give the development team structured, actionable feedback.'
      },
      {
        h: 'Record & fix',
        p: 'Log and triage every issue, then help fix it and verify the fix — closing the loop from report to resolution.'
      }
    ],
    gallery: []
  },
  {
    slug: '7th-pixel',
    name: 'Lynx ERP Solutions — Internship',
    tagline:
      'Summer web-development internship: contributed to client site builds in HTML/PHP and supported MySQL data management.',
    role: 'Web Development Intern',
    period: 'Jun 2019 — Aug 2019',
    status: 'Completed',
    liveUrl: 'https://lynxerp.ca/',
    tags: ['HTML', 'PHP', 'MySQL', 'Web development'],
    overview: [
      'My first professional web-development role. At Lynx ERP Solutions I contributed to client website builds using HTML and PHP and supported data management in MySQL.',
      'It was my early exposure to the data and server layer — the foundation for the WordPress / LAMP work and, later, the full-stack Postgres applications I build today.'
    ],
    highlights: [
      { h: 'Client site builds', p: 'Helped develop websites using HTML and PHP across multiple client projects.' },
      { h: 'Data management', p: 'Supported MySQL-backed data management tasks and dynamic pages.' }
    ],
    gallery: []
  }
]

export const featuredProject = projects.find((p) => p.featured) ?? projects[0]!

export const experience = [
  {
    role: 'Web Developer',
    org: 'Driving Headquarters',
    period: 'Sept 2019 — Present',
    link: 'https://drivingheadquarters.ca/',
    slug: 'driving-headquarters',
    points: [
      'Sole developer of the marketing site, payments, content, and full custom Nuxt + Supabase platform.',
      'Originally delivered on WordPress + Elementor, then migrated to a modern Nuxt 4 / Supabase architecture as the business grew into a real LMS.',
      'Own performance, SEO, security headers, backups, and uptime.'
    ]
  },
  {
    role: 'Web Developer',
    org: 'Tamil Heritage Month',
    period: 'Dec 2022 — 2025',
    link: 'https://tamilheritagemonth.com/',
    slug: 'tamil-heritage-month',
    points: [
      'Built the site end-to-end in Divi theme builder, including custom layouts and brand styling.',
      'Migrated the domain to a new hosting provider — DNS/nameserver cutover and post-transfer troubleshooting.'
    ]
  },
  {
    role: 'QA Tester',
    org: 'Lynx ERP Solutions',
    period: '2020 — Present',
    link: 'https://lynxerp.ca/',
    slug: '7th-pixel-qa',
    points: [
      'Test client websites across browsers and devices, documenting defects and UX issues with clear reproduction steps.',
      'Give structured feedback to the development team and track each issue through to resolution.',
      'Record, triage, and help fix the bugs found during QA — closing the loop from report to verified fix.'
    ]
  },
  {
    role: 'Web Development Intern',
    org: 'Lynx ERP Solutions',
    period: 'Jun 2019 — Aug 2019',
    link: 'https://lynxerp.ca/',
    slug: '7th-pixel',
    points: [
      'Contributed to client website builds using HTML and PHP.',
      'Supported MySQL data management — early exposure to the data + server layer that informs current work.'
    ]
  }
]

export const certifications = [
  { name: 'AWS Certified Solutions Architect – Associate', issuer: 'Amazon Web Services', badge: 'AWS' },
  { name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', badge: 'AWS' },
  { name: 'CompTIA Security+', issuer: 'CompTIA', badge: 'S+' },
  { name: 'Certified in Cybersecurity (CC)', issuer: 'ISC2', badge: 'CC' },
  { name: 'Google Cybersecurity Professional Certificate', issuer: 'Google', badge: 'G' }
]

export const nav = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'project', label: 'Project' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' }
]
