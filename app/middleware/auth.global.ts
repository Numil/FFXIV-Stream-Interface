export default defineNuxtRouteMiddleware(async () => {
    if (import.meta.server) return

    const authToken: string = await $fetch('/authenticate')

    useAuthToken().value = authToken
})
