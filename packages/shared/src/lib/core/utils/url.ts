import { addTrailingSlash, stripSpaces, stripTrailingSlash } from './string'
import { QueryParameters } from './types'

export function cleanUrl(
    url: string,
    removeQueryParameters: boolean = true,
    removedTrailingSlashes: boolean = true,
    removeSpaces: boolean = true
): string {
    let cleanedUrl = url

    if (removeQueryParameters) {
        cleanedUrl = cleanedUrl.split('?')[0]
    }

    if (removedTrailingSlashes) {
        cleanedUrl = stripTrailingSlash(cleanedUrl)
    }

    if (removeSpaces) {
        cleanedUrl = stripSpaces(cleanedUrl)
    }

    return cleanedUrl
}

type UrlParams = {
    base: string
    pathname?: string
    query?: QueryParameters
}

export function buildUrl(urlParams: UrlParams): URL | undefined {
    try {
        // URL parser requires a slash at the end of the base URL to parse the URL correctly
        const url = new URL(urlParams.pathname ?? '', addTrailingSlash(urlParams.base))
        for (const key of Object.keys(urlParams.query ?? {})) {
            const value = urlParams.query?.[key]
            if (!value) continue

            if (Array.isArray(value)) {
                url.searchParams.set(key, value.join(',') ?? '')
            } else {
                url.searchParams.set(key, String(value))
            }
        }
        return url
    } catch (error) {
        return undefined
    }
}
