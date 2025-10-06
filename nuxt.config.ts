// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ['nuxt-charts', '@nuxt/ui', '@nuxt/eslint', '@nuxt/image'],
    ssr: false,
    devtools: { enabled: true },
    css: ['~/assets/css/main.css'],
    runtimeConfig: {
        oauthToken: '',
        clientId: '',
        public: {
            guildId: ''
        }
    },
    compatibilityDate: '2025-03-29',
    typescript: {
        strict: true,
        typeCheck: true
    },
    eslint: {
        config: {
            stylistic: {
                quotes: 'single',
                semi: false,
                indent: 4,
                commaDangle: 'never'
            }
        }
    }
})
