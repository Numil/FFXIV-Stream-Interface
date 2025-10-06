// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  runtimeConfig: {
      oauthToken: '',
      clientId: '',
      public: {
          guildId: ''
      }
  },
  modules: ['nuxt-charts', '@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-03-29'
})
