import { PERFUMES } from './data/perfumes';

const SITE_URL = 'https://perfume.itsash.in';

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss'],
  app: {
    head: {
      title: 'Bloomé — Find Your Fragrance',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Pick your favorite fragrance notes and get AI-matched perfume recommendations powered by TensorFlow.js KNN.' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:image', content: `${SITE_URL}/favicon.svg` },
        { name: 'theme-color', content: '#FFF8EC' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap' }
      ],
      script: [
        { src: 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js', defer: true }
      ]
    }
  },
  css: ['~/assets/css/main.css'],
  // The homepage's KNN matcher needs `window` (TensorFlow.js CDN global) so it
  // stays client-rendered; detail pages render fine with SSR content.
  ssr: true,
  routeRules: {
    '/': { ssr: false }
  },
  nitro: {
    output: {
      publicDir: 'docs'
    },
    prerender: {
      routes: [
        '/',
        '/sitemap.xml',
        ...PERFUMES.map(p => `/perfume/${p.id}`)
      ],
      crawlLinks: true
    }
  },
  build: {}
});
