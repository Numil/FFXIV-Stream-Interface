export default defineNuxtRouteMiddleware(async () => {
    if (process.client) return

    const secret = useNuxtApp().$config.OAUTH_TOKEN
    const clientId = useNuxtApp().$config.CLIENT_ID

    const getAuthToken: any = await $fetch('/fflogs/oauth/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            client_id: clientId,
            client_secret: secret,
            grant_type: 'client_credentials'
        }
    })

    useAuthToken().value = getAuthToken.access_token
})