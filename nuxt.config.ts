// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['@/assets/css/main.css'], 
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
      'postcss-imported': {},
      'tailwindcss/nesting': {}
    }
  },
  modules: ['@nuxtjs/tailwindcss'],
  ssr: true,
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.js'
  }
})
