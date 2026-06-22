// Single source of truth for portfolio content.

export const profile = {
  name: 'Mohaimmen Bajwa',
  role: 'Full-Stack Web Developer',
  location: 'Richmond Hill, Ontario',
  email: 'mohaimmenbajwa2002@gmail.com',
  phone: '(647) 969-2300',
  github: 'https://github.com/depressedsauce',
  resume: '/Mohaimmen-Bajwa-Resume.pdf',
  tagline:
    'I build production web apps end-to-end — modern Vue/Nuxt frontends on Supabase Postgres with real auth, payments, and security.',
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
      { name: 'MySQL', use: 'Data management during my early work at 7th Pixel.' }
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
      { name: 'Account lifecycle / soft-delete', use: 'Archived/deleted accounts are rejected even with a valid token.' }
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
      { name: 'WebP optimization', use: 'Compressed, responsive images for fast page loads.' }
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
    slug: 'tamil-heritage-month',
    name: 'Tamil Heritage Month',
    tagline:
      'A content-driven heritage website built end-to-end in the Divi theme builder, including a full hosting + domain migration.',
    role: 'Web Developer',
    period: 'Dec 2022 — Present',
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
      { fig: 'fig. 01', src: '', caption: 'Home page — heritage hero & event sections' },
      { fig: 'fig. 02', src: '', caption: 'Custom Divi content layout' }
    ]
  },
  {
    slug: '7th-pixel-qa',
    name: '7th Pixel — QA Tester',
    tagline:
      'Ongoing QA role: testing client websites, giving structured feedback, and recording and fixing the issues that turn up.',
    role: 'QA Tester',
    period: '2020 — Present',
    status: 'Ongoing',
    liveUrl: 'https://www.7thpixel.ca/',
    tags: ['QA', 'Manual testing', 'Bug tracking', 'Cross-browser', 'UX feedback'],
    overview: [
      'Alongside my earlier internship, I do ongoing QA work for 7th Pixel. My focus is making sure client websites actually behave the way they should — before and after they ship.',
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
    name: '7th Pixel — Internship',
    tagline:
      'Summer web-development internship: contributed to client site builds in HTML/PHP and supported MySQL data management.',
    role: 'Web Development Intern',
    period: 'Jun 2019 — Aug 2019',
    status: 'Completed',
    liveUrl: 'https://www.7thpixel.ca/',
    tags: ['HTML', 'PHP', 'MySQL', 'Web development'],
    overview: [
      'My first professional web-development role. At 7th Pixel I contributed to client website builds using HTML and PHP and supported data management in MySQL.',
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
    period: 'Dec 2022 — Present',
    link: 'https://tamilheritagemonth.com/',
    slug: 'tamil-heritage-month',
    points: [
      'Built the site end-to-end in Divi theme builder, including custom layouts and brand styling.',
      'Migrated the domain to a new hosting provider — DNS/nameserver cutover and post-transfer troubleshooting.'
    ]
  },
  {
    role: 'QA Tester',
    org: '7th Pixel',
    period: '2020 — Present',
    link: 'https://www.7thpixel.ca/',
    slug: '7th-pixel-qa',
    points: [
      'Test client websites across browsers and devices, documenting defects and UX issues with clear reproduction steps.',
      'Give structured feedback to the development team and track each issue through to resolution.',
      'Record, triage, and help fix the bugs found during QA — closing the loop from report to verified fix.'
    ]
  },
  {
    role: 'Web Development Intern',
    org: '7th Pixel',
    period: 'Jun 2019 — Aug 2019',
    link: 'https://www.7thpixel.ca/',
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
