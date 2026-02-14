let cachedToken: string | null = null
let tokenExpiresAt = 0

async function getFFLogsToken(): Promise<string> {
    if (cachedToken && Date.now() < tokenExpiresAt) {
        return cachedToken
    }

    const { clientId, oauthToken } = useRuntimeConfig()

    const response = await $fetch<{ access_token: string; expires_in: number }>(
        'https://www.fflogs.com/oauth/token',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: {
                client_id: clientId,
                client_secret: oauthToken,
                grant_type: 'client_credentials'
            }
        }
    )

    cachedToken = response.access_token
    // Refresh 60s before actual expiry
    tokenExpiresAt = Date.now() + (response.expires_in - 60) * 1000

    return cachedToken
}

export async function fflogsQuery<T>(query: string): Promise<APIResponse<T>> {
    const token = await getFFLogsToken()

    return $fetch<APIResponse<T>>('https://www.fflogs.com/api/v2/client', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ query })
    })
}
