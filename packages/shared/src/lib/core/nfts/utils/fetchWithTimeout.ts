import { MILLISECONDS_PER_SECOND } from '@core/utils'

export async function fetchWithTimeout(url: string, secondsToTimeout: number, options: RequestInit): Promise<Response> {
    const controller = new AbortController()

    const timeoutId = setTimeout(() => {
        controller.abort()
    }, secondsToTimeout * MILLISECONDS_PER_SECOND)

    const response = await fetch(url, { ...options, signal: controller.signal })
    clearTimeout(timeoutId)

    return response
}
