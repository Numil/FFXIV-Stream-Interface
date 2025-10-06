export default defineNuxtRouteMiddleware(async () => {
    if (import.meta.server) return

    const authToken: any = await $fetch('/authenticate')

    useAuthToken().value = authToken
})
