<script setup lang="ts">
import { nav, profile } from '~/data/portfolio'

// Theme has two independent axes: which sheet (blueprint / paper) and
// which side of it (light / dark). Both live as data-* on <html>; the
// inline script in nuxt.config sets them before first paint.
type ThemeName = 'blueprint' | 'paper'
type Mode = 'light' | 'dark'

const THEME_KEY = 'portfolio-theme-name'
const MODE_KEY = 'portfolio-color-mode'

const themes = [
  { id: 'blueprint' as const, sym: '▦', label: 'blueprint' },
  { id: 'paper' as const, sym: '▤', label: 'paper' }
]

const theme = ref<ThemeName>('blueprint')
const mode = ref<Mode>('light')
const scrolled = ref(false)
const menuOpen = ref(false)

function applyTheme() {
  const el = document.documentElement
  el.setAttribute('data-theme', theme.value)
  el.setAttribute('data-mode', mode.value)
}

function setTheme(t: ThemeName) {
  if (theme.value === t) return
  theme.value = t
  applyTheme()
  localStorage.setItem(THEME_KEY, t)
}

function toggleMode() {
  mode.value = mode.value === 'dark' ? 'light' : 'dark'
  applyTheme()
  localStorage.setItem(MODE_KEY, mode.value)
}

function onScroll() {
  scrolled.value = window.scrollY > 12
}

onMounted(() => {
  const el = document.documentElement
  // Prefer whatever the pre-paint script already resolved, so the button
  // state can never disagree with what is on screen.
  const domTheme = el.getAttribute('data-theme')
  const domMode = el.getAttribute('data-mode')

  const savedTheme = localStorage.getItem(THEME_KEY)
  const savedMode = localStorage.getItem(MODE_KEY)
  // Older builds stored only 'light' | 'blueprint' under one key, and that
  // value meant the mode, not the sheet.
  const legacy = localStorage.getItem('portfolio-theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  theme.value = (domTheme === 'paper' || savedTheme === 'paper') ? 'paper' : 'blueprint'
  mode.value =
    (domMode as Mode | null) ??
    (savedMode as Mode | null) ??
    (legacy === 'blueprint' ? 'dark' : legacy === 'light' ? 'light' : prefersDark ? 'dark' : 'light')

  applyTheme()
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

const initials = profile.name
  .split(' ')
  .map((n) => n[0])
  .join('')
</script>

<template>
  <header class="hdr" :class="{ 'hdr--scrolled': scrolled }">
    <div class="wrap hdr__bar">
      <NuxtLink to="/" class="hdr__mark mono" aria-label="Home">
        <span class="hdr__box">{{ initials }}</span>
        <span class="hdr__name">{{ profile.name }}</span>
      </NuxtLink>

      <nav class="hdr__nav" :class="{ open: menuOpen }">
        <NuxtLink
          v-for="(item, i) in nav"
          :key="item.id"
          :to="`/#${item.id}`"
          class="mono hdr__link"
          @click="menuOpen = false"
        >
          <span class="hdr__idx">{{ String(i + 1).padStart(2, '0') }}</span>{{ item.label }}
        </NuxtLink>
      </nav>

      <div class="hdr__actions">
        <a
          class="hdr__icon"
          :href="profile.github"
          target="_blank"
          rel="noopener"
          aria-label="GitHub"
          title="GitHub"
        >
          <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true">
            <path
              fill="currentColor"
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"
            />
          </svg>
        </a>
        <div class="hdr__seg" role="group" aria-label="Theme">
          <button
            v-for="t in themes"
            :key="t.id"
            class="hdr__toggle hdr__segbtn mono"
            :class="{ 'is-on': theme === t.id }"
            :aria-pressed="theme === t.id"
            :title="`${t.label} theme`"
            @click="setTheme(t.id)"
          >
            <span class="hdr__togglesym" aria-hidden="true">{{ t.sym }}</span>
            <span class="hdr__toggletxt">{{ t.label }}</span>
          </button>
        </div>
        <button
          class="hdr__toggle mono"
          :aria-pressed="mode === 'dark'"
          :title="mode === 'dark' ? 'Switch to light' : 'Switch to dark'"
          @click="toggleMode"
        >
          <span class="hdr__togglesym" aria-hidden="true">{{ mode === 'dark' ? '☀' : '☾' }}</span>
          <span class="hdr__toggletxt">{{ mode === 'dark' ? 'light' : 'dark' }}</span>
        </button>
        <button
          class="hdr__burger"
          :aria-expanded="menuOpen"
          aria-label="Menu"
          @click="menuOpen = !menuOpen"
        >
          <span /><span /><span />
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.hdr {
  position: sticky;
  top: 0;
  z-index: 50;
  transition: background .2s ease, border-color .2s ease, backdrop-filter .2s;
  border-bottom: 1px solid transparent;
}
.hdr--scrolled {
  background: color-mix(in srgb, var(--paper) 82%, transparent);
  backdrop-filter: blur(8px);
  border-bottom: 1px dashed var(--card-border);
}
/* Paper has no glass: the bar is a solid strip of the sheet with a ruled
   edge under it, not a blurred pane. */
:root[data-theme='paper'] .hdr--scrolled {
  background: var(--paper);
  backdrop-filter: none;
  border-bottom: 2px solid var(--note-edge);
}

.hdr__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  height: 64px;
}
.hdr__mark {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  font-weight: 700;
}
.hdr__box {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 1.5px solid var(--accent);
  color: var(--accent);
  border-radius: 3px;
  font-size: 13px;
}
.hdr__name { font-size: 14px; color: var(--ink); }

.hdr__nav { display: flex; gap: 22px; }
.hdr__link {
  font-size: 13px;
  text-decoration: none;
  color: var(--ink-soft);
  transition: color .15s;
}
.hdr__link:hover { color: var(--accent); }
.hdr__idx { color: var(--accent-2); margin-right: 6px; font-size: 11px; }

.hdr__actions { display: flex; align-items: center; gap: 10px; }
.hdr__toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  padding: 7px 12px;
  border: 1px solid var(--card-border);
  border-radius: 3px;
  background: var(--card);
  color: var(--ink);
  cursor: pointer;
  white-space: nowrap;
  transition: border-color .15s, color .15s;
}
.hdr__toggle:hover { border-color: var(--accent); color: var(--accent); }

/* theme picker — two joined cells sharing one outline */
.hdr__seg { display: inline-flex; }
.hdr__seg .hdr__segbtn { border-radius: 0; }
.hdr__seg .hdr__segbtn:first-child { border-radius: 3px 0 0 3px; }
.hdr__seg .hdr__segbtn:last-child { border-radius: 0 3px 3px 0; border-left-width: 0; }
.hdr__seg .hdr__segbtn:last-child:hover,
.hdr__seg .hdr__segbtn:last-child.is-on { border-left-width: 1px; margin-left: -1px; }
.hdr__segbtn { color: var(--ink-faint); }
.hdr__segbtn.is-on {
  color: var(--accent);
  border-color: var(--accent);
  background: color-mix(in srgb, var(--accent) 12%, var(--card));
}
.hdr__segbtn.is-on .hdr__togglesym { opacity: 1; }
.hdr__togglesym { opacity: .85; }

.hdr__icon {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 1px solid var(--card-border);
  border-radius: 3px;
  background: var(--card);
  color: var(--ink-soft);
  transition: color .15s, border-color .15s;
}
.hdr__icon:hover { color: var(--accent); border-color: var(--accent); }

.hdr__burger { display: none; }

/* Nav + GitHub + two theme cells + the mode toggle stop fitting well
   before the burger takes over, so drop the button labels early. */
@media (max-width: 1080px) {
  .hdr__toggletxt { display: none; }
  .hdr__toggle { padding: 8px 10px; }
  .hdr__nav { gap: 16px; }
}

@media (max-width: 760px) {
  .hdr__name { display: none; }
  /* icon-only toggles so the burger always fits */
  .hdr__toggletxt { display: none; }
  .hdr__toggle { padding: 8px 9px; }
  .hdr__actions { gap: 6px; }
  .hdr__nav {
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    flex-direction: column;
    gap: 0;
    background: var(--paper);
    border-bottom: 1px dashed var(--card-border);
    max-height: 0;
    overflow: hidden;
    transition: max-height .25s ease;
  }
  .hdr__nav.open { max-height: 320px; }
  .hdr__link { padding: 14px 24px; border-bottom: 1px dashed var(--card-border); }
  .hdr__burger {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
    width: 38px;
    height: 34px;
    border: 1px solid var(--card-border);
    border-radius: 3px;
    background: var(--card);
    cursor: pointer;
  }
  .hdr__burger span {
    display: block;
    height: 1.5px;
    background: var(--ink);
    margin: 0 7px;
  }
}
</style>
