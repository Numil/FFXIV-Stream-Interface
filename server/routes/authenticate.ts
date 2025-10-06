export default defineEventHandler(async () => {
    const secret = useRuntimeConfig().oauthToken
    const clientId = useRuntimeConfig().clientId

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

    console.log(getAuthToken)

    return getAuthToken.access_token
})
