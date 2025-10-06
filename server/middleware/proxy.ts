import { defineEventHandler, proxyRequest } from 'h3'

export default defineEventHandler((event: any) => {
    let { originalUrl } = event.node.req

    if (originalUrl.indexOf('fflogs') > 0) {
        originalUrl = originalUrl.replace('/fflogs', '')
        const redirectTo = 'https://www.fflogs.com' + originalUrl

        return proxyRequest(event, redirectTo)
    }
})
