<script setup lang="ts">
import { projects } from '~/data/portfolio'

const route = useRoute()
const project = projects.find((p) => p.slug === route.params.slug)

if (!project) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true })
}

const others = projects.filter((p) => p.slug !== project!.slug)

useHead({
  title: `${project.name} — Mohaimmen Bajwa`,
  meta: [{ name: 'description', content: project.tagline }]
})
</script>

<template>
  <article class="detail" v-if="project">
    <div class="wrap">
      <NuxtLink to="/#project" class="mono back">← back to portfolio</NuxtLink>

      <!-- header -->
      <header class="dhead">
        <p class="eyebrow">// case_study — {{ project.status }}</p>
        <h1 class="dhead__title">{{ project.name }}</h1>
        <p class="dhead__meta mono">
          <span>{{ project.role }}</span>
          <span class="dot">·</span>
          <span>{{ project.period }}</span>
        </p>
        <p class="dhead__tagline">{{ project.tagline }}</p>
        <div class="dhead__btns">
          <a v-if="project.liveUrl" class="btn btn--primary" :href="project.liveUrl" target="_blank" rel="noopener">
            Live site ↗
          </a>
          <a v-if="project.repoUrl" class="btn" :href="project.repoUrl" target="_blank" rel="noopener">
            Source ↗
          </a>
        </div>
        <div class="dhead__tags">
          <span v-for="t in project.tags" :key="t" class="chip">{{ t }}</span>
        </div>
      </header>

      <!-- overview -->
      <section class="block">
        <div class="section-head" v-reveal>
          <span class="num">01</span><h2>Overview</h2>
        </div>
        <p v-for="(para, i) in project.overview" :key="i" class="prose" v-reveal>{{ para }}</p>
      </section>

      <!-- gallery -->
      <section v-if="project.gallery.length" class="block">
        <div class="section-head" v-reveal>
          <span class="num">02</span><h2>Screens</h2>
        </div>
        <div class="shots">
          <figure v-for="(s, i) in project.gallery" :key="s.fig" class="shot" v-reveal="i * 60">
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
      </section>

      <!-- highlights -->
      <section v-if="project.highlights.length" class="block">
        <div class="section-head" v-reveal>
          <span class="num">03</span><h2>What I built</h2>
        </div>
        <div class="blocks">
          <div v-for="(h, i) in project.highlights" :key="h.h" class="card hl" v-reveal="i * 50">
            <span class="hl__num mono">{{ String(i + 1).padStart(2, '0') }}</span>
            <div>
              <h3>{{ h.h }}</h3>
              <p>{{ h.p }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- challenges -->
      <section v-if="project.challenges && project.challenges.length" class="block">
        <div class="section-head" v-reveal>
          <span class="num">04</span><h2>Challenges & decisions</h2>
        </div>
        <div class="blocks">
          <div v-for="(c, i) in project.challenges" :key="c.h" class="card hl" v-reveal="i * 50">
            <span class="hl__num mono" style="color: var(--accent-2)">!</span>
            <div>
              <h3>{{ c.h }}</h3>
              <p>{{ c.p }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- other projects -->
      <section class="block">
        <div class="section-head" v-reveal>
          <span class="num">→</span><h2>Other projects</h2>
        </div>
        <div class="others">
          <NuxtLink v-for="o in others" :key="o.slug" :to="`/projects/${o.slug}`" class="card other" v-reveal>
            <span class="other__name">{{ o.name }}</span>
            <span class="other__meta mono">{{ o.period }}</span>
            <span class="other__go mono">view →</span>
          </NuxtLink>
        </div>
      </section>
    </div>
  </article>
</template>

<style scoped>
.detail { padding: clamp(28px, 6vh, 64px) 0 80px; }
.back {
  display: inline-block;
  font-size: 13px;
  color: var(--ink-soft);
  text-decoration: none;
  margin-bottom: 26px;
}
.back:hover { color: var(--accent); }

.dhead { border-bottom: 1px dashed var(--card-border); padding-bottom: 28px; margin-bottom: 8px; }
.dhead__title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(30px, 6vw, 54px);
  letter-spacing: -0.02em;
  line-height: 1.05;
  margin: 12px 0 8px;
}
.dhead__meta { color: var(--ink-soft); font-size: 14px; display: flex; gap: 10px; }
.dhead__meta .dot { color: var(--accent-2); }
.dhead__tagline { color: var(--ink-soft); max-width: 68ch; font-size: clamp(16px, 2vw, 19px); margin: 16px 0 22px; }
.dhead__btns { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 20px; }
.dhead__tags { display: flex; flex-wrap: wrap; gap: 8px; }

.block { padding: clamp(34px, 6vh, 56px) 0 0; }
.prose { font-size: clamp(15px, 1.9vw, 18px); line-height: 1.75; color: var(--ink); max-width: 72ch; margin: 0 0 16px; }

.blocks { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr)); gap: 18px; }
.hl { display: flex; gap: 14px; }
.hl__num { color: var(--accent); font-size: 14px; padding-top: 2px; }
.hl h3 { font-family: var(--font-display); margin: 0 0 6px; font-size: 16px; }
.hl p { margin: 0; color: var(--ink-soft); font-size: 14px; line-height: 1.6; }

/* gallery (mirrors homepage plates) */
.shots { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap: 18px; }
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
  position: absolute; inset: 0;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;
  color: var(--ink-faint);
}
.shot__fig { color: var(--accent); font-size: 13px; }
.shot__pending { font-size: 11px; letter-spacing: 0.08em; }
.shot figcaption { margin-top: 8px; font-size: 12px; color: var(--ink-soft); }

.others { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap: 16px; }
.other {
  display: flex; flex-direction: column; gap: 6px;
  text-decoration: none; color: var(--ink);
  transition: transform .12s ease, box-shadow .15s ease;
}
.other:hover { transform: translate(-2px, -2px); box-shadow: 4px 4px 0 var(--accent); }
.other__name { font-family: var(--font-display); font-weight: 600; font-size: 16px; }
.other__meta { font-size: 12px; color: var(--ink-faint); }
.other__go { font-size: 12px; color: var(--accent); margin-top: 4px; }
</style>
