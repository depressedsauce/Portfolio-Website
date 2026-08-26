// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'Mohaimmen Bajwa — Full-Stack Web Developer',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Mohaimmen Bajwa — Full-stack web developer in Richmond Hill, ON. Vue/Nuxt + Supabase Postgres, payments, security, and a custom multi-tenant SaaS platform.'
        },
        { name: 'theme-color', content: '#0b1f3a' },
        { property: 'og:title', content: 'Mohaimmen Bajwa — Full-Stack Web Developer' },
        {
          property: 'og:description',
          content:
            'Full-stack developer building production Vue/Nuxt + Supabase apps. 5+ years shipping client websites.'
        },
        { property: 'og:type', content: 'website' }
      ],
      // Resolve the theme before first paint so there is no flash of the
      // wrong sheet. Mirrors the logic in TheHeader.vue.
      script: [
        {
          tagPosition: 'head',
          innerHTML: `(function(){try{var d=document.documentElement,ls=localStorage;` +
            `var t=ls.getItem('portfolio-theme-name');var m=ls.getItem('portfolio-color-mode');` +
            `if(!m){var l=ls.getItem('portfolio-theme');if(l==='blueprint')m='dark';else if(l==='light')m='light';}` +
            `if(!m)m=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';` +
            `d.setAttribute('data-theme',t==='paper'?'paper':'blueprint');` +
            `d.setAttribute('data-mode',m==='dark'?'dark':'light');}catch(e){}})()`
        }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href:
            // Blueprint: Space Grotesk / JetBrains Mono / Inter.
            // Paper: Lora / Courier Prime / Caveat.
            'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;500;600&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Courier+Prime:wght@400;700&family=Caveat:wght@500;600;700&display=swap'
        }
      ]
    }
  }
})
