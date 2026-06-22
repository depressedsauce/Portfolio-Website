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
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;500;600&display=swap'
        }
      ]
    }
  }
})
