<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import {
  profile,
  stats,
  skills,
  projects,
  featuredProject,
  experience,
  certifications
} from '~/data/portfolio'

// The homepage spotlights one project; full detail lives at /projects/<slug>.
const featured = featuredProject
// Everything else that has a page of its own, so the spotlight isn't the only
// way in — otherwise a full case study is reachable only by guessing its URL.
const otherProjects = projects.filter((p) => p.slug !== featuredProject.slug)

// Typewriter "wheel" for the hero role: types out a role, holds, erases, then
// rolls the next role into place and types it — cycling through profile.roles.
// roleIndex drives the :key on the typed span, so each new role remounts and
// replays the vertical roll-in animation.
const roles = profile.roles
const typedRole = ref('')
// Rendered one span per character so each new letter can animate in on its
// own — on paper that reads as ink landing rather than a key being struck.
const typedChars = computed(() => Array.from(typedRole.value))
const roleIndex = ref(0)
const typingDone = ref(false) // solid cursor while typing/erasing, blinks on hold
let typeTimer: ReturnType<typeof setTimeout> | undefined

const TYPE_MS = 55 // per-char while typing
const ERASE_MS = 28 // per-char while erasing (snappier)
// A hand moves slower than a keyboard, so paper writes at its own pace.
const HAND_TYPE_MS = 95
const HAND_ERASE_MS = 45
const onPaper = () => document.documentElement.getAttribute('data-theme') === 'paper'
const typePace = () => (onPaper() ? HAND_TYPE_MS : TYPE_MS)
const erasePace = () => (onPaper() ? HAND_ERASE_MS : ERASE_MS)
const HOLD_MS = 1500 // pause on a fully-typed role
const SWAP_MS = 350 // beat after erase, lets the wheel roll-in land

onMounted(() => {
  const reduced =
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  if (reduced) {
    // No motion: show the primary role, no cycling.
    typedRole.value = profile.role
    typingDone.value = true
    return
  }

  const typeIn = () => {
    const full = roles[roleIndex.value] ?? ''
    let i = 0
    const step = () => {
      typedRole.value = full.slice(0, i)
      if (i < full.length) {
        i++
        typeTimer = setTimeout(step, typePace())
      } else {
        typingDone.value = true // start the blink during the hold
        typeTimer = setTimeout(eraseOut, HOLD_MS)
      }
    }
    step()
  }

  const eraseOut = () => {
    typingDone.value = false
    const step = () => {
      if (typedRole.value.length > 0) {
        typedRole.value = typedRole.value.slice(0, -1)
        typeTimer = setTimeout(step, erasePace())
      } else {
        // Advance to the next role — remounts the span and rolls it in.
        roleIndex.value = (roleIndex.value + 1) % roles.length
        typeTimer = setTimeout(typeIn, SWAP_MS)
      }
    }
    step()
  }

  // Small lead-in so the name lands before the role starts typing.
  typeTimer = setTimeout(typeIn, 400)
})

onBeforeUnmount(() => clearTimeout(typeTimer))
</script>

<template>
  <!-- ============ HERO ============ -->
  <section class="hero">
    <div class="wrap hero__grid">
      <div class="hero__main">
        <p class="eyebrow" v-reveal><span class="only-code">//</span>{{ profile.location }}</p>
        <h1 class="hero__name" v-reveal="80">{{ profile.name }}</h1>
        <p class="hero__role mono" v-reveal="140">
          <span class="hero__caret only-code">&gt;</span><span
            class="hero__roll"
            :key="roleIndex"
          ><span v-for="(ch, i) in typedChars" :key="i" class="hero__ch">{{ ch }}</span></span><span
            class="hero__cursor only-code"
            :class="{ 'hero__cursor--blink': typingDone }"
            aria-hidden="true"
          >_</span><span
            class="hero__nib only-hand"
            :class="{ 'hero__nib--rest': typingDone }"
            aria-hidden="true"
          />
        </p>
        <p class="hero__tag" v-reveal="200">{{ profile.tagline }}</p>

        <div class="hero__cta" v-reveal="260">
          <a class="btn btn--primary" href="#project">View featured project →</a>
          <a class="btn" :href="profile.resume" download>↓ Résumé (PDF)</a>
          <a class="btn" :href="`mailto:${profile.email}`">Hire me</a>
        </div>

        <ul class="hero__stats" v-reveal="320">
          <li v-for="s in stats" :key="s.label">
            <span class="hero__statval mono"><StatCounter :value="s.value" /></span>
            <span class="hero__statlbl">{{ s.label }}</span>
          </li>
        </ul>
      </div>

      <!-- "spec sheet" -->
      <aside class="hero__spec card" v-reveal="200">
        <p class="spec__title mono">
          <span class="only-code">// spec_sheet.json</span><span class="only-hand">at a glance</span>
        </p>
        <dl class="spec__list mono">
          <div><dt>role</dt><dd>{{ profile.role }}</dd></div>
          <div><dt>based</dt><dd>{{ profile.location }}</dd></div>
          <div><dt>stack</dt><dd>Nuxt 4 · Vue 3 · Supabase</dd></div>
          <div><dt>focus</dt><dd>full-stack · cloud</dd></div>
          <div><dt>status</dt><dd class="spec__open">available for work</dd></div>
        </dl>
      </aside>
    </div>
  </section>

  <!-- ============ ABOUT ============ -->
  <section id="about">
    <div class="wrap">
      <div class="section-head" v-reveal>
        <span class="num">01</span>
        <h2>About</h2>
      </div>
      <div class="about__grid">
        <p class="about__lead" v-reveal>{{ profile.summary }}</p>
        <div class="about__notes" v-reveal="120">
          <p class="note mono">✎ 6+ years, multi-year client relationships.</p>
          <p class="note mono">✎ Takes projects beyond WordPress when they outgrow it.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ SKILLS ============ -->
  <section id="skills">
    <div class="wrap">
      <div class="section-head" v-reveal>
        <span class="num">02</span>
        <h2>Skills</h2>
      </div>
      <div class="skills__grid">
        <div v-for="(group, i) in skills" :key="group.group" class="card skills__card" v-reveal="i * 60">
          <h3 class="skills__title mono">{{ group.group }}</h3>
          <div class="skills__chips">
            <span
              v-for="item in group.items"
              :key="item.name"
              :class="['chip', 'skill', { 'skill--key': item.key }]"
              tabindex="0"
            >
              {{ item.name }}
              <span class="skill__tip" role="tooltip">{{ item.use }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ FEATURED PROJECT ============ -->
  <section id="project">
    <div class="wrap">
      <div class="section-head" v-reveal>
        <span class="num">03</span>
        <h2>Featured Project</h2>
      </div>

      <div class="card proj" v-reveal>
        <div class="proj__head">
          <div>
            <h3 class="proj__title">{{ featured.name }}</h3>
            <p class="proj__meta mono">{{ featured.period }} · {{ featured.status }}</p>
          </div>
          <div class="proj__headbtns">
            <NuxtLink class="btn btn--primary" :to="`/projects/${featured.slug}`">Read the deep dive →</NuxtLink>
            <a v-if="featured.liveUrl" class="btn" :href="featured.liveUrl" target="_blank" rel="noopener">Live site ↗</a>
          </div>
        </div>

        <p class="proj__blurb">{{ featured.tagline }}</p>

        <div class="proj__stack">
          <span v-for="s in featured.tags" :key="s" class="chip">{{ s }}</span>
        </div>

        <div class="proj__highlights">
          <div v-for="(h, i) in featured.highlights" :key="h.h" class="proj__hl" v-reveal="i * 50">
            <span class="proj__hlnum mono">{{ String(i + 1).padStart(2, '0') }}</span>
            <div>
              <h4>{{ h.h }}</h4>
              <p>{{ h.p }}</p>
            </div>
          </div>
        </div>

        <!-- screenshot plates -->
        <div class="shots">
          <figure v-for="(s, i) in featured.gallery" :key="s.fig" class="shot" v-reveal="i * 60">
            <div class="shot__frame">
              <img v-if="s.src" :src="s.src" :alt="s.caption" loading="lazy" />
              <div v-else class="shot__placeholder mono">
                <span class="shot__fig">{{ s.fig }}</span>
                <span class="shot__pending">screenshot pending</span>
              </div>
            </div>
            <figcaption class="mono">{{ s.fig }} — {{ s.caption }}</figcaption>
          </figure>
        </div>
      </div>

      <!-- everything else with a page of its own -->
      <div class="more" v-reveal>
        <h3 class="more__title mono">More work</h3>
        <div class="more__grid">
          <NuxtLink
            v-for="p in otherProjects"
            :key="p.slug"
            :to="`/projects/${p.slug}`"
            class="card more__card"
          >
            <span class="more__name">{{ p.name }}</span>
            <span class="more__meta mono">{{ p.role }} · {{ p.period }}</span>
            <span class="more__tag">{{ p.tagline }}</span>
            <span class="more__go mono">Read →</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ EXPERIENCE ============ -->
  <section id="experience">
    <div class="wrap">
      <div class="section-head" v-reveal>
        <span class="num">04</span>
        <h2>Experience</h2>
      </div>
      <div class="exp">
        <article v-for="(job, i) in experience" :key="job.org" class="exp__row" v-reveal="i * 60">
          <div class="exp__when mono">{{ job.period }}</div>
          <div class="exp__body card">
            <div class="exp__top">
              <h3>{{ job.role }} <span class="exp__at">— {{ job.org }}</span></h3>
              <a v-if="job.link" :href="job.link" target="_blank" rel="noopener" class="mono exp__link">↗</a>
            </div>
            <ul>
              <li v-for="p in job.points" :key="p">{{ p }}</li>
            </ul>
            <NuxtLink v-if="job.slug" :to="`/projects/${job.slug}`" class="mono exp__more">
              Learn more →
            </NuxtLink>
          </div>
        </article>
      </div>

      <!-- certifications -->
      <div class="edu" v-reveal>
        <h3 class="edu__h mono">// certifications</h3>
        <div class="edu__grid">
          <div v-for="c in certifications" :key="c.name" class="card cert__card">
            <span class="cert__badge mono">{{ c.badge }}</span>
            <div>
              <h4>{{ c.name }}</h4>
              <p class="mono cert__issuer">{{ c.issuer }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ CONTACT ============ -->
  <section id="contact" class="contact">
    <div class="wrap">
      <div class="card contact__card" v-reveal>
        <p class="eyebrow"><span class="only-code">//</span>let's build something</p>
        <h2 class="contact__h">Looking to hire a developer who ships?</h2>
        <p class="contact__p">
          I'm available for full-stack, frontend, or cloud roles. The fastest way to reach me is email.
        </p>
        <div class="contact__links">
          <a class="btn btn--primary" :href="`mailto:${profile.email}`">{{ profile.email }}</a>
          <a class="btn" :href="`tel:${profile.phone.replace(/[^0-9+]/g, '')}`">{{ profile.phone }}</a>
          <a class="btn" :href="profile.resume" download>↓ Résumé</a>
          <a class="btn" :href="profile.github" target="_blank" rel="noopener">GitHub ↗</a>
        </div>
      </div>
      <footer class="foot mono">
        <span>© {{ new Date().getFullYear() }} {{ profile.name }}</span>
        <span class="foot__links">
          <a :href="profile.github" target="_blank" rel="noopener">GitHub</a>
          <a :href="`mailto:${profile.email}`">Email</a>
          <a :href="profile.resume" download>Résumé</a>
        </span>
        <span>built with Nuxt 4 · drawn on graph paper</span>
      </footer>
    </div>
  </section>
</template>

<style scoped>
/* ---------- HERO ---------- */
.hero { padding-top: clamp(40px, 7vh, 80px); }
.hero__grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 40px;
  align-items: center;
}
.hero__name {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(40px, 8vw, 80px);
  line-height: 1.02;
  letter-spacing: -0.02em;
  margin: 14px 0 6px;
}
.hero__role {
  font-size: clamp(16px, 2.4vw, 22px);
  color: var(--accent);
  margin: 0 0 18px;
  /* Perspective so each role slot rolls in like a 3D wheel. */
  perspective: 420px;
}
.hero__caret { color: var(--accent-2); }
/* Each new role remounts (keyed on roleIndex) and rolls down into place. */
.hero__roll {
  display: inline-block;
  transform-origin: top center;
  animation: hero-wheel-in 0.42s cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes hero-wheel-in {
  from {
    transform: translateY(-0.55em) rotateX(-88deg);
    opacity: 0;
  }
  to {
    transform: translateY(0) rotateX(0);
    opacity: 1;
  }
}
@media (prefers-reduced-motion: reduce) {
  .hero__roll { animation: none; }
}
.hero__cursor {
  color: var(--accent-2);
  font-weight: 700;
  margin-left: 1px;
}
/* While typing the cursor is solid; once finished it blinks. */
.hero__cursor--blink { animation: hero-caret-blink 1s steps(2, start) infinite; }
@keyframes hero-caret-blink {
  to { opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .hero__cursor--blink { animation: none; }
}
/* Per-letter spans need to keep their spaces. */
.hero__roll { white-space: pre; }

/* ---------- Paper: the role is written, not typed ----------
   Script face, no prompt, no wheel-roll, and each letter settles onto the
   page like ink instead of snapping in like a keystroke. */
:root[data-theme='paper'] .hero__role {
  font-family: var(--font-hand);
  font-size: clamp(26px, 4vw, 36px);
}
:root[data-theme='paper'] .hero__roll { animation: none; }
:root[data-theme='paper'] .hero__ch { animation: hero-ink-in 0.26s ease-out both; }
@keyframes hero-ink-in {
  from { opacity: 0; filter: blur(1.6px); transform: translateY(0.08em); }
  to { opacity: 1; filter: blur(0); transform: none; }
}

/* The pen itself: a nib-width stroke held at a writing angle. It lifts off
   the page when the word is finished rather than blinking like a caret. */
.hero__nib {
  width: 2px;
  height: 0.9em;
  margin-left: 4px;
  border-radius: 2px;
  background: var(--accent-2);
  rotate: 14deg;
  vertical-align: -0.1em;
}
:root[data-theme='paper'] .hero__nib { display: inline-block; }
.hero__nib--rest { animation: hero-nib-lift 0.5s ease forwards; }
@keyframes hero-nib-lift {
  to { opacity: 0; transform: translateY(-0.3em); }
}

@media (prefers-reduced-motion: reduce) {
  .hero__ch { animation: none; }
  .hero__nib--rest { animation: none; opacity: 0; }
}

.hero__tag {
  max-width: 52ch;
  color: var(--ink-soft);
  font-size: clamp(15px, 1.8vw, 18px);
  margin: 0 0 26px;
}
.hero__cta { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 34px; }

.hero__stats {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  border-top: 1px dashed var(--card-border);
  padding-top: 22px;
}
.hero__stats li { display: flex; flex-direction: column; gap: 2px; }
.hero__statval { font-size: clamp(22px, 3vw, 30px); font-weight: 700; color: var(--ink); }
.hero__statlbl { font-size: 12px; color: var(--ink-faint); line-height: 1.3; }

.hero__spec { align-self: center; }
.spec__title { font-size: 12px; color: var(--ink-faint); margin: 0 0 14px; }
.spec__list { display: grid; gap: 10px; font-size: 13px; margin: 0; }
.spec__list > div { display: grid; grid-template-columns: 64px 1fr; gap: 12px; }
.spec__list dt { color: var(--accent); }
.spec__list dd { margin: 0; color: var(--ink); }
.spec__open { color: var(--accent-3) !important; }
.spec__open::before { content: '● '; font-size: 10px; }

/* ---------- ABOUT ---------- */
.about__grid { display: grid; grid-template-columns: 1.7fr 1fr; gap: 36px; }
.about__lead { font-size: clamp(17px, 2.2vw, 21px); line-height: 1.7; margin: 0; }
.about__notes { display: flex; flex-direction: column; gap: 12px; }
.note {
  font-size: 13px;
  color: var(--accent-2);
  border-left: 2px solid var(--accent-2);
  padding-left: 12px;
  margin: 0;
}

/* ---------- SKILLS ---------- */
.skills__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: 18px;
  /* Cards size to their own content. Stretching them to the tallest in the row
     leaves dead space under the short ones — invisible on a transparent card,
     glaring on a paper theme sticky note. */
  align-items: start;
}
.skills__title { font-size: 13px; color: var(--accent); margin: 0 0 14px; transition: color .18s; }
.skills__chips { display: flex; flex-wrap: wrap; gap: 8px; }

/* card highlight on hover */
.skills__card {
  transition: transform .18s ease, box-shadow .2s ease, border-color .2s ease;
}
.skills__card:hover,
.skills__card:focus-within {
  transform: translateY(-4px);
  border-color: var(--accent);
  box-shadow: 0 14px 34px -16px color-mix(in srgb, var(--accent) 55%, transparent);
  z-index: 5;
}
.skills__card:hover .skills__title,
.skills__card:focus-within .skills__title { color: var(--accent-2); }

/* skill chip + speech-box tooltip */
.skill { position: relative; cursor: help; transition: border-color .15s, color .15s; }
.skill:hover,
.skill:focus-visible {
  border-color: var(--accent);
  color: var(--ink);
  outline: none;
}
/* standout / depth skills surfaced in the case study */
.skill--key {
  border-color: color-mix(in srgb, var(--accent-2) 55%, var(--card-border));
  color: var(--ink);
}
.skill--key:hover,
.skill--key:focus-visible { border-color: var(--accent-2); }
.skill--key .skill__tip { border-color: var(--accent-2); }
.skill--key .skill__tip::after { border-top-color: var(--accent-2); }
.skill__tip {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%) translateY(5px);
  width: max-content;
  max-width: 240px;
  padding: 9px 12px;
  background: var(--ink);
  color: var(--paper);
  border: 1px solid var(--accent);
  border-radius: 4px;
  font-family: var(--font-body);
  font-size: 12px;
  line-height: 1.45;
  letter-spacing: 0;
  white-space: normal;
  text-align: left;
  box-shadow: 0 10px 24px -12px rgba(0, 0, 0, 0.5);
  opacity: 0;
  display: none;
  pointer-events: none;
  z-index: 20;
}
/* little pointer */
.skill__tip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: var(--accent);
}
.skill:hover .skill__tip,
.skill:focus .skill__tip,
.skill:focus-visible .skill__tip {
  display: block;
  animation: tipIn .16s ease forwards;
}
@keyframes tipIn {
  from { opacity: 0; transform: translateX(-50%) translateY(5px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .skills__card, .skill, .skill__tip { transition: none; }
}
/* keep tooltips from pushing the page sideways on small screens */
@media (max-width: 560px) {
  .skill__tip { max-width: min(240px, calc(100vw - 40px)); }
}

/* ---------- PROJECT ---------- */
.proj { padding: clamp(22px, 4vw, 36px); }
.proj__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 18px;
  flex-wrap: wrap;
}
.proj__headbtns { display: flex; gap: 10px; flex-wrap: wrap; }
.proj__title { font-family: var(--font-display); font-size: clamp(22px, 3.4vw, 30px); margin: 0; }
.proj__meta { color: var(--ink-faint); font-size: 13px; margin: 4px 0 0; }
.proj__blurb { color: var(--ink-soft); max-width: 70ch; margin: 16px 0; font-size: 16px; }
.proj__stack { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 26px; }
.proj__highlights {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
  gap: 18px;
  border-top: 1px dashed var(--card-border);
  padding-top: 24px;
}
.proj__hl { display: flex; gap: 14px; }
.proj__hlnum { color: var(--accent-2); font-size: 13px; padding-top: 2px; }
.proj__hl h4 { margin: 0 0 4px; font-size: 15px; }
.proj__hl p { margin: 0; color: var(--ink-soft); font-size: 14px; line-height: 1.6; }

/* ---------- SCREENSHOT PLATES ---------- */
.shots {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
  gap: 18px;
  margin-top: 26px;
  border-top: 1px dashed var(--card-border);
  padding-top: 24px;
}
.shot { margin: 0; }
.shot__frame {
  position: relative;
  border: 1px solid var(--card-border);
  border-radius: 3px;
  overflow: hidden;
  aspect-ratio: 16 / 10;
  background:
    linear-gradient(var(--grid-minor) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-minor) 1px, transparent 1px);
  background-size: 16px 16px;
}
.shot__frame img { width: 100%; height: 100%; object-fit: cover; display: block; }
.shot__placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: var(--ink-faint);
}
.shot__fig { color: var(--accent); font-size: 13px; }
.shot__pending { font-size: 11px; letter-spacing: 0.08em; }
.shot figcaption { margin-top: 8px; font-size: 12px; color: var(--ink-soft); }

/* ---------- MORE WORK ---------- */
.more { margin-top: 34px; }
.more__title {
  font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase;
  color: var(--ink-faint); margin: 0 0 14px;
}
.more__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
  gap: 16px;
}
.more__card {
  display: flex; flex-direction: column; gap: 6px;
  text-decoration: none; color: var(--ink);
  transition: transform .12s ease, box-shadow .15s ease;
}
.more__card:hover { transform: translate(-2px, -2px); box-shadow: 4px 4px 0 var(--accent); }
.more__name { font-family: var(--font-display); font-weight: 600; font-size: 16px; }
.more__meta { font-size: 11.5px; color: var(--ink-faint); }
.more__tag { font-size: 13px; color: var(--ink-soft); line-height: 1.45; margin-top: 2px; }
.more__go { font-size: 12px; color: var(--accent); margin-top: auto; padding-top: 8px; }

/* ---------- EXPERIENCE ---------- */
.exp { display: flex; flex-direction: column; gap: 18px; }
.exp__row { display: grid; grid-template-columns: 160px 1fr; gap: 20px; }
.exp__when { color: var(--accent); font-size: 13px; padding-top: 22px; }
.exp__top { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
.exp__body h3 { font-family: var(--font-display); font-size: 18px; margin: 0 0 8px; }
.exp__at { color: var(--ink-soft); font-weight: 500; }
.exp__link { color: var(--accent); text-decoration: none; font-size: 16px; }
.exp__body ul { margin: 0; padding-left: 18px; color: var(--ink-soft); }
.exp__body li { margin: 4px 0; font-size: 14px; }
.exp__more {
  display: inline-block;
  margin-top: 12px;
  font-size: 13px;
  color: var(--accent);
  text-decoration: none;
  border-bottom: 1px dashed var(--accent);
  padding-bottom: 1px;
}
.exp__more:hover { color: var(--accent-2); border-color: var(--accent-2); }

.edu { margin-top: 40px; }
.edu__h { color: var(--ink-faint); font-size: 13px; margin: 0 0 14px; }
.edu__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: 18px; }
.cert__card { display: flex; align-items: center; gap: 16px; }
.cert__badge {
  flex: none;
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border: 1.5px solid var(--accent-2);
  border-radius: 4px;
  color: var(--accent-2);
  font-size: 13px;
  font-weight: 700;
}
.cert__card h4 { font-family: var(--font-display); margin: 0 0 4px; font-size: 15px; line-height: 1.3; }
.cert__issuer { margin: 0; font-size: 12px; color: var(--ink-soft); }

/* ---------- CONTACT ---------- */
.contact__card { text-align: center; padding: clamp(30px, 6vw, 56px); }
.contact__h { font-family: var(--font-display); font-size: clamp(24px, 4vw, 38px); margin: 14px 0 10px; }
.contact__p { color: var(--ink-soft); max-width: 50ch; margin: 0 auto 24px; }
.contact__links { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; }
.foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px 18px;
  margin-top: 30px;
  padding-top: 18px;
  border-top: 1px dashed var(--card-border);
  font-size: 12px;
  color: var(--ink-faint);
}
.foot__links { display: flex; gap: 16px; }
.foot__links a { color: var(--ink-soft); text-decoration: none; }
.foot__links a:hover { color: var(--accent); }

/* ---------- RESPONSIVE ---------- */
@media (max-width: 860px) {
  .hero__grid { grid-template-columns: 1fr; }
  .hero__spec { order: -1; }
  .about__grid { grid-template-columns: 1fr; gap: 22px; }
  .hero__stats { grid-template-columns: repeat(2, 1fr); }
  .exp__row { grid-template-columns: 1fr; gap: 8px; }
  .exp__when { padding-top: 0; }
}
</style>
