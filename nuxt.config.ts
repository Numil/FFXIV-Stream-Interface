// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  runtimeConfig: {
      oauthToken: '',
      clientId: '',
      public: {
          guildId: ''
      }
  },

  modules: ['@nuxtjs/tailwindcss'],
  compatibilityDate: '2025-03-29'
})