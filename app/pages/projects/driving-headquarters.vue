<script setup lang="ts">
// Dedicated deep-dive case study for Driving Headquarters.
// This static route takes precedence over the generic [slug].vue page.
useHead({
  title: 'Driving Headquarters Platform — Case Study — Mohaimmen Bajwa',
  meta: [
    {
      name: 'description',
      content:
        'Architecture & design deep dive: a multi-location driving school’s site grown into a single-codebase web + mobile platform — authorization, payments, document ingest, live GPS, and safe DB ops.'
    }
  ]
})

const toc = [
  { id: 'context', label: 'Context & goals' },
  { id: 'screens', label: 'Inside the product' },
  { id: 'architecture', label: 'System architecture' },
  { id: 'authz', label: 'Three-layer authorization' },
  { id: 'payments', label: 'Payments & financial ledger' },
  { id: 'ingest', label: 'Document-ingest pipeline' },
  { id: 'gps', label: 'Live GPS trip tracker' },
  { id: 'security', label: 'Hardened public surface' },
  { id: 'dbops', label: 'Safe database operations' },
  { id: 'decisions', label: 'Key design decisions' },
  { id: 'stack', label: 'Stack & takeaways' }
]

// Redacted product screenshots. All student/instructor PII (names, emails,
// licences, phone numbers) is irreversibly masked.
const shots = [
  { src: '/shots/dhq/admin-dashboard.png', cap: 'Admin dashboard — the daily operational pulse: revenue, outstanding balances, pending registrations and what needs attention.' },
  { src: '/shots/dhq/admin-analytics.png', cap: 'Analytics — period KPIs (revenue, enrolments, lessons, pass rate) alongside lifetime metrics and monthly trends.' },
  { src: '/shots/dhq/admin-students.png', cap: 'Student directory — a unified view of auth-backed and legacy-archive students with status, package and balance filters.' },
  { src: '/shots/dhq/admin-registrations.png', cap: 'Registrations — incoming leads from the public site, triaged through submitted → in-review → invited → enrolled.' },
  { src: '/shots/dhq/admin-instructors.png', cap: 'Instructors — vehicles, licensing, expenses and incidents, with active/total load per instructor.' },
  { src: '/shots/dhq/admin-email-intake.png', cap: 'Email intake — every forwarded email waits for human review; nothing auto-files. The heart of the document-ingest pipeline.' },
  { src: '/shots/dhq/admin-bulk-ingest.png', cap: 'Bulk document ingest — upload many files at once; each is parsed, fingerprinted, matched to a student and queued for review.' },
  { src: '/shots/dhq/admin-support.png', cap: 'Support — student help conversations from the portal, mirrored onto each student’s dossier.' },
  { src: '/shots/dhq/admin-profile.png', cap: 'Admin profile — TOTP two-factor enrolment and password management for staff accounts.' },
  { src: '/shots/dhq/student-console.png', cap: 'Student console — a gamified “driver dossier”: lessons logged, in-car hours, theory status and a one-tap book-a-lesson.' },
  { src: '/shots/dhq/student-field-guide.png', cap: 'Student console, themed — the same dashboard rendered as a “field guide”. The UI is fully themeable per student.' },
  { src: '/shots/dhq/student-profile.png', cap: 'Student profile — personal info, emergency contact and security settings (all personal data redacted here).' }
]
</script>

<template>
  <article class="cs">
    <div class="wrap">
      <!-- breadcrumb -->
      <div class="cs__crumb">
        <NuxtLink to="/#project" class="mono cs__back">← back to portfolio</NuxtLink>
        <a class="btn" href="https://drivingheadquarters.ca/" target="_blank" rel="noopener">Live site ↗</a>
      </div>

      <!-- hero -->
      <header class="cs__hero">
        <p class="eyebrow">// case study · architecture &amp; design deep dive</p>
        <h1 class="cs__title">Driving Headquarters Platform</h1>
        <p class="cs__lede">
          How a multi-location driving school's marketing site grew into a single-codebase
          web + mobile platform — covering authorization, payments, an email-driven document
          pipeline, a live GPS lesson tracker, and a safe database-operations workflow against
          a live production Postgres.
        </p>
        <div class="cs__meta mono">
          <div><span class="k">Role</span><span class="v">Sole architect &amp; developer</span></div>
          <div><span class="k">Timeline</span><span class="v">2022 — present · in production</span></div>
          <div><span class="k">Surface</span><span class="v">Web · PWA · Android (Capacitor)</span></div>
          <div><span class="k">Users</span><span class="v">Students · Parents · Instructors · Admins</span></div>
        </div>
      </header>

      <div class="cs__layout">
        <!-- TOC -->
        <aside class="cs__tocwrap">
          <p class="cs__toctitle mono">Contents</p>
          <ol class="cs__toc">
            <li v-for="t in toc" :key="t.id"><a :href="`#${t.id}`">{{ t.label }}</a></li>
          </ol>
        </aside>

        <!-- main -->
        <main class="cs__body">
          <!-- 01 CONTEXT -->
          <section id="context" v-reveal>
            <h2><span class="num">01</span>Context &amp; goals</h2>
            <p class="lede">
              The business started with a WordPress + Elementor brochure site. As it grew into a
              real driving school across Richmond Hill, Markham and Vaughan, the operational load —
              enrolments, payments, document collection, lesson scheduling — outgrew plugins and
              spreadsheets.
            </p>
            <p>
              The mandate was to replace a patchwork of WordPress, manual email, and spreadsheet
              bookkeeping with one system that the public, students, parents, instructors and
              office staff could all use — without paying per-seat for an off-the-shelf LMS that
              still wouldn't model Ontario's BDE (Beginner Driver Education) and MTO certification
              workflows.
            </p>
            <h3>Constraints that shaped the design</h3>
            <ul>
              <li><strong>One developer, one codebase.</strong> No room for a separate mobile app team
                or a microservice fleet — everything had to live in a single deployable that one
                person can reason about and ship safely.</li>
              <li><strong>Real money, real PII.</strong> Credit-card payments and government ID
                documents meant security and auditability couldn't be bolted on later.</li>
              <li><strong>Live production from day one.</strong> The cutover happened against a
                running business, so schema changes had to be safe and reversible.</li>
              <li><strong>Field use.</strong> Instructors record routes from a moving car on Android
                phones with patchy signal — the mobile experience had to survive offline.</li>
            </ul>
          </section>

          <!-- 02 SCREENS -->
          <section id="screens" v-reveal>
            <h2><span class="num">02</span>Inside the product</h2>
            <p class="lede">
              A tour of the running platform — the admin operations console and the student-facing
              app. All student, parent and instructor PII (names, emails, driver-licence numbers and
              phone numbers) has been irreversibly redacted from these screenshots.
            </p>
            <div class="shots">
              <figure v-for="(s, i) in shots" :key="s.src" class="shot">
                <a :href="s.src" target="_blank" rel="noopener" class="shot__frame">
                  <img :src="s.src" :alt="s.cap" loading="lazy" decoding="async" width="1890" height="900" />
                </a>
                <figcaption>
                  <span class="mono fig">fig. {{ String(i + 1).padStart(2, '0') }}</span>
                  {{ s.cap }}
                </figcaption>
              </figure>
            </div>
            <p class="shots__note mono">// redacted regions are masked, not blurred — the underlying pixels are destroyed.</p>
          </section>

          <!-- 03 ARCHITECTURE -->
          <section id="architecture" v-reveal>
            <h2><span class="num">03</span>System architecture</h2>
            <p class="lede">
              A single <strong>Nuxt 4</strong> application serves the public marketing site, all four
              authenticated dashboards, and the entire server API. It is wrapped by Capacitor 6 to
              ship as an Android app, and backed by Supabase for database, auth, storage and realtime.
            </p>

            <div class="archcard card">
              <p class="archcard__cap mono">// architecture.svg — request flow</p>
              <ArchitectureDiagram />
            </div>

            <div class="grid2">
              <div class="card mini">
                <h4 class="mono">Frontend</h4>
                <p>Vue 3 + Nuxt 4, Tailwind v4, Nuxt UI. Server-rendered marketing pages for SEO;
                  client-hydrated dashboards behind auth. Shipped as a PWA and, via Capacitor 6, an
                  Android APK from the same source.</p>
              </div>
              <div class="card mini">
                <h4 class="mono">Server</h4>
                <p>Nitro server routes (<code>server/api/**</code>) provide the REST layer. Server
                  middleware adds security headers and CSRF. Shared <code>server/utils</code> hold
                  auth guards, the ledger, the ingest pipeline, rate limiting and more.</p>
              </div>
              <div class="card mini">
                <h4 class="mono">Data</h4>
                <p>Supabase Postgres is the system of record. Row-Level Security is the last line of
                  defence; an immutable transaction ledger is the financial source of truth. Storage
                  holds avatars and student documents.</p>
              </div>
              <div class="card mini">
                <h4 class="mono">Integrations</h4>
                <p>Moneris Hosted Checkout (payments), Resend (transactional + inbound email), IMAP
                  via <code>imapflow</code>, Leaflet + CARTO tiles (maps), reCAPTCHA v3, and
                  Capacitor background-geolocation.</p>
              </div>
            </div>

            <div class="callout decision">
              <span class="label mono">Why a single codebase</span>
              <p>One Nuxt app means one auth model, one type system end-to-end, one deploy, and one
                place to enforce a security rule. The mobile app is the same code wrapped by
                Capacitor — no second API, no contract drift between web and native. For a solo
                maintainer this is the difference between shippable and not.</p>
            </div>
          </section>

          <!-- 03 AUTHZ -->
          <section id="authz" v-reveal>
            <h2><span class="num">04</span>Three-layer authorization</h2>
            <p class="lede">
              Access is enforced independently at three layers, so that a bug or bypass in one does
              not grant access. The guiding rule: <strong>even a leaked service key shouldn't be able
              to read another user's data through the front door.</strong>
            </p>

            <div class="layers">
              <div class="layer">
                <span class="tier mono">Layer 1 · Client</span>
                <span class="body"><b>Route middleware</b> (<code>app/middleware/{auth,admin,…}.ts</code>)
                  checks the Supabase session and the user's role before a protected page renders —
                  fast UX, redirects the unauthenticated to <code>/login</code>. Treated as
                  convenience, never as the security boundary.</span>
              </div>
              <div class="layer arrow">↓</div>
              <div class="layer">
                <span class="tier mono">Layer 2 · Server</span>
                <span class="body"><b><code>requireAuth</code> / <code>requireRole</code> guards</b>
                  run inside every Nitro route. They resolve the user from the session, load the
                  profile, reject archived/soft-deleted accounts, and hand back both a service client
                  and an RLS-scoped client.</span>
              </div>
              <div class="layer arrow">↓</div>
              <div class="layer">
                <span class="tier mono">Layer 3 · Database</span>
                <span class="body"><b>Postgres RLS policies</b> driven by a <b>JWT custom-claims hook</b>
                  that stamps the user's role into their token. Policies decide row visibility in the
                  database itself — the final, non-bypassable boundary.</span>
              </div>
            </div>

            <h3>The server guard does the real work</h3>
            <p>
              Every protected endpoint opens with one call. The guard verifies the session, loads the
              profile with the <em>service</em> role, and — critically — refuses tokens belonging to
              accounts that have since been archived or self-deleted, closing the race where a
              still-valid JWT outlives the account:
            </p>
            <pre><code><span class="c">// server/utils/require-auth.ts</span>
<span class="k">export async function</span> <span class="f">requireAdmin</span>(event) {
  <span class="k">const</span> ctx = <span class="k">await</span> <span class="f">resolveAuth</span>(event)   <span class="c">// 401 if no valid session</span>
  <span class="k">if</span> (ctx.profile.role !== <span class="s">'ADMIN'</span>)
    <span class="k">throw</span> <span class="f">createError</span>({ statusCode: <span class="s">403</span>, statusMessage: <span class="s">'Forbidden: Admins only'</span> })
  <span class="k">return</span> ctx
}

<span class="c">// resolveAuth rejects archived / soft-deleted profiles even when the</span>
<span class="c">// session token is still technically valid:</span>
<span class="k">if</span> (rawRole === <span class="s">'archived'</span> || profile.archived || profile.deleted_at)
  <span class="k">throw</span> <span class="f">createError</span>({ statusCode: <span class="s">403</span>, statusMessage: <span class="s">'Account is no longer active'</span> })</code></pre>

            <div class="callout">
              <span class="label mono">Design choice · two clients, deliberately</span>
              <p>The guard returns both a <code>service</code> client (bypasses RLS, for legitimate
                cross-user admin work) and a <code>userClient</code> (respects RLS). Endpoints default
                to the RLS-scoped client; the service client is reserved for operations that genuinely
                need it, keeping the powerful key out of the common path.</p>
            </div>
          </section>

          <!-- 04 PAYMENTS -->
          <section id="payments" v-reveal>
            <h2><span class="num">05</span>Payments &amp; financial ledger</h2>
            <p class="lede">
              Payments run through <strong>Moneris Hosted Checkout</strong>, so raw card data never
              touches the server. The hard part isn't taking the payment — it's making the money
              provably correct afterward.
            </p>

            <h3>Never trust the client about money</h3>
            <p>
              After Moneris returns a checkout ticket, the server performs a <strong>server-to-server
              receipt verification</strong> and sources the amount <em>exclusively</em> from the
              Moneris receipt — the client-reported status and amount are ignored entirely:
            </p>
            <pre><code><span class="c">// server/api/portal/payment-verify.post.ts</span>
<span class="k">if</span> (data.response?.success === <span class="s">'true'</span> &amp;&amp; receipt?.result === <span class="s">'a'</span>) {
  <span class="c">// Amount comes ONLY from the verified receipt, never the request body.</span>
  <span class="k">const</span> amount = <span class="f">Number</span>(receipt.cc?.amount)
  <span class="k">if</span> (!<span class="f">Number.isFinite</span>(amount) || amount &lt;= <span class="s">0</span>)
    <span class="k">throw</span> <span class="f">createError</span>({ statusCode: <span class="s">502</span>, statusMessage: <span class="s">'Receipt missing an amount'</span> })
  <span class="c">// ...IDOR ownership check, then write to the ledger.</span>
}</code></pre>

            <h3>Defences layered onto every payment write</h3>
            <ul>
              <li><strong>IDOR ownership guard.</strong> Before writing, the endpoint confirms the
                registration belongs to the authenticated user — a payment can't be applied to
                someone else's account by guessing an ID.</li>
              <li><strong>Idempotency keys.</strong> A duplicate confirmation (double-click, retry,
                network replay) returns the cached result instead of recording the payment twice; a
                unique index on the Moneris ticket is the backstop.</li>
              <li><strong>Ledger as source of truth.</strong> Every payment is an immutable row in
                <code>lms_student_transactions</code>. The enrollment's outstanding balance is
                <em>derived</em> from the ledger, never edited in place — so the books always
                reconcile.</li>
              <li><strong>Rate limiting</strong> on the verify endpoint to blunt receipt-probing.</li>
            </ul>

            <div class="callout decision">
              <span class="label mono">Design choice · charges and payments are separate, immutable rows</span>
              <p>Enrolment creates a <code>charge</code> transaction (package price + HST stored
                separately as <code>tax_rate</code>/<code>tax_amount</code>); each payment is its own
                <code>payment</code> row. Balance = sum of the ledger. This models partial payments,
                installment plans, and e-Transfer reconciliation cleanly, and gives the admin
                financial dashboard an audit trail it can trust.</p>
            </div>

            <h3>Beyond cards</h3>
            <p>
              The same ledger backs <strong>payment-plan installments</strong> (paying one installment
              marks it paid and completes the plan when the last one clears) and an
              <strong>e-Transfer claim/reconciliation workflow</strong> for customers who pay by
              Interac instead of card.
            </p>
          </section>

          <!-- 05 INGEST -->
          <section id="ingest" v-reveal>
            <h2><span class="num">06</span>Document-ingest pipeline</h2>
            <p class="lede">
              Driving schools drown in forwarded paperwork: BDE receipts, MTO certificates, driver
              licences, payment confirmations. This pipeline turns a forwarded email into a document
              attached to the right student — with a human in the loop.
            </p>

            <h3>Two transports, one pipeline</h3>
            <p>
              Email arrives via either an <strong>IMAP poller</strong> (<code>imapflow</code>, on a
              cron) or a <strong>Resend inbound webhook</strong>. Each transport's only job is to
              produce a <code>NormalisedEmail</code>; everything downstream — idempotency, batching,
              extraction, matching, dedup, logging, notification — lives in one shared module so the
              two paths can't diverge.
            </p>

            <div class="layers steps">
              <div class="layer"><span class="tier mono">1 · Idempotency</span><span class="body">A previously-seen <code>Message-ID</code> is never reprocessed — but it's still logged as a <b>duplicate</b> so replays show up in the inbox instead of vanishing silently.</span></div>
              <div class="layer"><span class="tier mono">2 · Trust</span><span class="body">Sender must match a pinned env allow-list (system senders like Trubicars/Interac) <b>or</b> an admin-managed DB allow-list. Misses are logged and dropped — no admin noise.</span></div>
              <div class="layer"><span class="tier mono">3 · Extract</span><span class="body">Each attachment — plus the <b>email body itself as a virtual attachment</b> — is routed to a per-kind extractor (BDE, MTO cert, licence, Moneris, Interac) or a generic fallback.</span></div>
              <div class="layer"><span class="tier mono">4 · Match</span><span class="body">A <b>fuzzy student matcher</b> scores candidates on licence number, name, email and phone against the full profile pool, returning matched / ambiguous / unmatched with a reason.</span></div>
              <div class="layer"><span class="tier mono">5 · Dedup</span><span class="body">Two layers: <b>byte-exact</b> (SHA-256 of the file) against any student, and <b>content-fingerprint</b> (key fields) against the matched student, so the same enrolment isn't filed twice.</span></div>
              <div class="layer"><span class="tier mono">6 · Review</span><span class="body">Nothing auto-files. <b>Every</b> item — even a high-confidence match — waits in the admin inbox for confirmation. Admins are notified, throttled to once per hour to avoid spam.</span></div>
            </div>

            <div class="callout">
              <span class="label mono">Design choice · the carrier email is the document</span>
              <p>For most receipts the PDF is a formality — the real content is in the email body.
                Treating the body as a virtual <code>.txt</code> attachment means the specialised
                Trubicars / Interac / Moneris extractors get a crack at it through the exact same code
                path as a real file, with no special-casing.</p>
            </div>

            <div class="callout decision">
              <span class="label mono">Design choice · human-in-the-loop, on purpose</span>
              <p>Auto-promotion was built and then deliberately disabled. Misfiling a government ID to
                the wrong student is a privacy incident; the cost of a one-click admin confirmation is
                trivial by comparison. The matcher does the heavy lifting and ranks candidates — the
                human just approves.</p>
            </div>
          </section>

          <!-- 06 GPS -->
          <section id="gps" v-reveal>
            <h2><span class="num">07</span>Live GPS trip tracker</h2>
            <p class="lede">
              Instructors record the actual route of a lesson from their phone; students and admins
              replay it on a map afterward. The challenge is capturing GPS reliably from a moving car
              with the screen off and intermittent signal.
            </p>

            <h3>Two runtimes from one composable</h3>
            <ul>
              <li><strong>PWA (browser):</strong> <code>navigator.geolocation.watchPosition</code> plus
                a Wake Lock. Works with the screen on, but the OS throttles a backgrounded tab.</li>
              <li><strong>Capacitor native (Android APK):</strong>
                <code>@capacitor-community/background-geolocation</code> runs a true Android
                <strong>foreground service</strong>, so tracking continues with the screen off and the
                app backgrounded — the real field configuration.</li>
            </ul>

            <div class="callout">
              <span class="label mono">Design choice · offline-first capture</span>
              <p>Every GPS fix is appended to an <strong>IndexedDB pending-queue before</strong> any
                network flush, then deleted only after the server confirms receipt. If the page dies —
                browser crash, OS kill, force-close — the next session finds the stranded fixes and
                replays them before starting a new trip. No lesson route is lost to a dropped
                connection.</p>
            </div>

            <p>
              Fixes are flushed in batches (every 20s or 100 points), with per-segment distance from a
              <strong>haversine</strong> calculation and stall detection. Playback streams over
              <strong>Supabase Realtime</strong> onto a <strong>Leaflet</strong> map with CARTO
              basemap tiles (OSM as fallback) — so a parent can watch the route fill in live, or
              review it later.
            </p>
          </section>

          <!-- 07 SECURITY -->
          <section id="security" v-reveal>
            <h2><span class="num">08</span>Hardened public surface</h2>
            <p class="lede">
              The marketing site and auth endpoints are the exposed attack surface. Defence is layered
              here too — headers, CSRF, rate limiting, and graduated bot defence.
            </p>

            <h3>Content Security Policy with nonce + strict-dynamic</h3>
            <p>
              <code>nuxt-security</code> emits a <strong>per-request nonce</strong> and
              <code>strict-dynamic</code> CSP, so any script the app didn't explicitly load won't
              execute — even if attacker-controlled content lands in the DOM. The allow-lists are
              scoped tightly: Moneris and reCAPTCHA for scripts/frames, Supabase and the map tile
              CDNs for connections and images, and nothing else.
            </p>
            <pre><code><span class="c">// nuxt.config.ts — script-src</span>
<span class="s">'script-src'</span>: [
  <span class="s">"'self'"</span>, <span class="s">"'nonce-{{nonce}}'"</span>, <span class="s">"'strict-dynamic'"</span>,
  <span class="s">'https://gateway.moneris.com'</span>, <span class="s">'https://www.google.com/recaptcha/'</span>,
]</code></pre>

            <h3>Defence in depth around forms &amp; mutations</h3>
            <ul>
              <li><strong>Custom CSRF</strong> (<code>server/middleware/02-csrf.ts</code>): a
                double-submit cookie pattern with a constant-time token comparison, enforced on every
                mutating method and bypassed only for the Moneris webhook.</li>
              <li><strong>Rate limiting</strong> (<code>server/utils/rate-limit.ts</code>): IP- and
                session-scoped limits on sensitive endpoints, owned in-app rather than delegated to the
                module.</li>
              <li><strong>Graduated bot defence</strong> on public forms: reCAPTCHA v3 (server-verified
                secret), a honeypot field, and dwell-time analysis — escalating friction only for
                traffic that looks automated.</li>
              <li><strong>Strict transport &amp; framing:</strong> HSTS with preload,
                <code>X-Frame-Options: SAMEORIGIN</code>, <code>nosniff</code>, and a locked-down
                Permissions-Policy.</li>
            </ul>

            <div class="callout">
              <span class="label mono">Pragmatic note</span>
              <p>Cross-origin isolation (COOP/COEP) is deliberately left loose: Moneris checkout posts
                messages back to our window, and tighter isolation breaks that handshake. Security work
                is only finished when the payment flow still works — the config documents exactly why
                each relaxation exists.</p>
            </div>
          </section>

          <!-- 08 DB OPS -->
          <section id="dbops" v-reveal>
            <h2><span class="num">09</span>Safe database operations</h2>
            <p class="lede">
              Schema changes against a live business database are where solo projects usually get hurt.
              The workflow here is built so a migration can be written, tested against real-shaped data,
              and rolled forward without guesswork.
            </p>
            <ul>
              <li><strong>60+ versioned SQL migrations</strong> under the <strong>Supabase CLI</strong>
                workflow — <code>supabase/migrations/</code> is the single source of truth, with the
                current production schema baselined into it.</li>
              <li><strong>Sandboxed local Postgres.</strong> An <code>env-switch</code> flow flips the
                whole app between CLOUD (real Supabase + real third-party APIs) and SANDBOX (local
                Supabase in Docker, third-party APIs disabled), with a safety rail that refuses cloud
                commands while in sandbox mode.</li>
              <li><strong>Playwright QA harness.</strong> A <code>qa-test</code> pass runs a full
                sandboxed regression — build health, public pages, auth flows, role gating, RLS/GRANT
                checks, and payment/registration API smoke — and <em>refuses to run in cloud mode</em>,
                so a test pass can never touch production data.</li>
              <li><strong>Least-privilege grants.</strong> Recent migrations explicitly revoke
                <code>anon</code> and <code>authenticated</code> access on admin-only tables and views,
                so RLS isn't the only thing standing between a token and a sensitive table.</li>
            </ul>
            <div class="callout decision">
              <span class="label mono">Design choice · make the safe path the easy path</span>
              <p>Because sandbox mode is one command away and QA refuses to run against prod, the
                low-friction option is also the safe one. That's what keeps a one-person project from
                shipping a Friday-night migration straight into the live ledger.</p>
            </div>
          </section>

          <!-- 09 DECISIONS -->
          <section id="decisions" v-reveal>
            <h2><span class="num">10</span>Key design decisions, condensed</h2>
            <p class="lede">Every choice below traded simplicity or speed for a property the
              business actually needed — auditability, safety, or solo-maintainability.</p>

            <div class="grid2">
              <div class="card mini"><h4 class="mono">Single Nuxt codebase</h4><p>One auth model, one type system, one deploy; the Android app is the same code via Capacitor. Cost: the bundle does everything. Worth it for a solo maintainer.</p></div>
              <div class="card mini"><h4 class="mono">Authz in three layers</h4><p>Client UX + server guards + Postgres RLS. Redundant on purpose — no single bypass grants data access.</p></div>
              <div class="card mini"><h4 class="mono">Immutable ledger</h4><p>Money is append-only; balances are derived. Slightly more code, but the books always reconcile and there's a real audit trail.</p></div>
              <div class="card mini"><h4 class="mono">Human-in-the-loop ingest</h4><p>The matcher ranks; a human confirms. Trades a click for never misfiling a government ID to the wrong person.</p></div>
              <div class="card mini"><h4 class="mono">Offline-first GPS</h4><p>Persist fixes to IndexedDB before flushing; replay on crash. More moving parts, zero lost routes.</p></div>
              <div class="card mini"><h4 class="mono">Sandbox-by-default ops</h4><p>The safe path (local Postgres, QA that refuses prod) is the easy path, so it's the one that gets used.</p></div>
            </div>
          </section>

          <!-- 10 STACK -->
          <section id="stack" v-reveal>
            <h2><span class="num">11</span>Stack &amp; takeaways</h2>

            <div class="stats">
              <div class="stat"><div class="n mono">60<span class="u">+</span></div><div class="l">versioned SQL migrations</div></div>
              <div class="stat"><div class="n mono">4</div><div class="l">role-based dashboards</div></div>
              <div class="stat"><div class="n mono">3</div><div class="l">authorization layers</div></div>
              <div class="stat"><div class="n mono">1</div><div class="l">codebase, web + mobile</div></div>
            </div>

            <h3>Full stack</h3>
            <div class="chips">
              <span v-for="t in ['Nuxt 4','Vue 3','TypeScript','Supabase (Postgres + Auth + Storage + Realtime)','Tailwind v4','Nuxt UI','Nitro','Moneris Hosted Checkout','Resend','imapflow (IMAP)','Capacitor 6','Leaflet + CARTO','reCAPTCHA v3','nuxt-security','Playwright','Supabase CLI']" :key="t" class="chip">{{ t }}</span>
            </div>

            <h3>What I'd carry forward</h3>
            <p>
              The biggest lever wasn't any single feature — it was making the <strong>safe path the
              default path</strong>: layered authz so a mistake fails closed, an immutable ledger so
              the money is always auditable, and a sandbox/QA workflow so schema changes can't quietly
              hit production. For a one-person team running real payments and PII, those guardrails are
              what make moving fast survivable.
            </p>
          </section>

          <footer class="cs__foot mono">
            <span>Driving Headquarters Platform · architecture deep dive</span>
            <span>
              <NuxtLink to="/#project">← portfolio</NuxtLink> ·
              <a href="https://drivingheadquarters.ca/" target="_blank" rel="noopener">drivingheadquarters.ca ↗</a>
            </span>
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
.cs__layout { display: grid; grid-template-columns: 220px 1fr; gap: 48px; }
.cs__tocwrap { position: sticky; top: 84px; align-self: start; max-height: calc(100vh - 100px); overflow-y: auto; padding-top: 38px; }
.cs__toctitle { font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--ink-faint); margin: 0 0 12px; }
.cs__toc { list-style: none; margin: 0; padding: 0; counter-reset: toc; }
.cs__toc a {
  display: block; padding: 6px 0 6px 28px; position: relative;
  font-size: 13px; color: var(--ink-soft); border-left: 1px solid var(--card-border); line-height: 1.4;
  text-decoration: none;
}
.cs__toc a::before {
  counter-increment: toc; content: counter(toc, decimal-leading-zero);
  position: absolute; left: 6px; top: 8px; font-family: var(--font-mono); font-size: 10px; color: var(--ink-faint);
}
.cs__toc a:hover { color: var(--ink); border-left-color: var(--accent); }

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

/* architecture sketch card */
.archcard { max-width: 520px; margin: 22px 0; padding: 18px 20px 14px; }
.archcard__cap { font-size: 12px; color: var(--ink-faint); margin: 0 0 10px; }

/* product screenshot gallery */
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

/* code blocks */
.cs__body pre {
  background: #071426;
  border: 1px solid rgba(120, 180, 255, 0.18);
  border-radius: 8px; padding: 16px 18px; overflow-x: auto; margin: 18px 0;
}
.cs__body pre code { font-family: var(--font-mono); font-size: 12.6px; line-height: 1.6; color: #c9d6e6; background: none; border: none; padding: 0; }
.cs__body pre .c { color: #6f859f; }
.cs__body pre .k { color: #7eb0fb; }
.cs__body pre .s { color: #b8e0a0; }
.cs__body pre .f { color: #e0a868; }
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
