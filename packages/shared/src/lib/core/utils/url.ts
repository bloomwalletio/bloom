import { stripSpaces, stripTrailingSlash } from './string'

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

export function buildQueryParametersFromObject(obj: Record<string, string | number | boolean | string[]>): string {
    return Object.keys(obj)
        .map(
            (key) =>
                `${encodeURIComponent(key)}=${
                    Array.isArray(obj[key])
                        ? encodeURIComponent((obj[key] as unknown[]).join(','))
                        : encodeURIComponent(obj[key] as string | number | boolean)
                }`
        )
        .join('&')
}
