// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    runtimeConfig: {
        OAUTH_TOKEN: process.env.NUXT_OAUTH_TOKEN,
        CLIENT_ID: process.env.NUXT_CLIENT_ID
    },
    modules: ['@nuxtjs/tailwindcss']
})
