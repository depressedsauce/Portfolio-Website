# Mohaimmen Bajwa — Portfolio

A graph-paper / blueprint themed personal portfolio built with **Nuxt 4** + **Vue 3** (no UI framework, hand-rolled CSS).

## Features
- Engineer's graph-paper background (light "paper" + dark "blueprint" themes, toggle in the header, respects system preference)
- Single-page scroll: Hero, About, Skills, Featured Project, Experience, Education, Contact
- Scroll-reveal animations (IntersectionObserver, respects `prefers-reduced-motion`)
- Fully responsive with a mobile nav
- All content lives in one file: [`app/data/portfolio.ts`](app/data/portfolio.ts) — edit there to update the site

## Develop
```bash
npm install
npm run dev          # http://localhost:3000
```

## Build
```bash
npm run build        # SSR build  -> .output/
npm run generate     # static site -> .output/public/  (good for Netlify / GitHub Pages / Cloudflare Pages)
npm run preview      # preview the production build locally
```

## Deploy
The static `generate` output in `.output/public` can be dropped on any static host.
For SSR, deploy the `.output` folder to a Node host (Vercel/Netlify auto-detect Nuxt).

## Edit your content
Open [`app/data/portfolio.ts`](app/data/portfolio.ts) and change `profile`, `skills`,
`featured`, `experience`, and `education`. Colours/fonts live in
[`app/assets/css/main.css`](app/assets/css/main.css) (CSS variables at the top).
