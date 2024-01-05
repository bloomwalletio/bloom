import { MILLISECONDS_PER_SECOND } from '@core/utils'

export async function fetchWithTimeout(url: string, secondsToTimeout: number, options: RequestInit): Promise<Response> {
    const controller = new AbortController()

    const timeoutId = setTimeout(() => {
        console.log('fetchWithTimeout', 'timeout')
        controller.abort()
    }, secondsToTimeout * MILLISECONDS_PER_SECOND)

    console.log(timeoutId,'fetchWithTimeout', 'start', url, options)
    const response = await fetch(url, { ...options, signal: controller.signal })
    console.log(timeoutId, 'fetchWithTimeout', 'end')
    clearTimeout(timeoutId)

    return response
}
