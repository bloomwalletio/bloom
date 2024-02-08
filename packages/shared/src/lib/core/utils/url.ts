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

export function validateUrlDomain(url: string, domain: string, checkHttps: boolean = true): boolean {
    const origin = new URL(url).origin;
    console.log('hostname', origin)
    const escapedDomain = domain.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    console.log('escapedDomain', escapedDomain)
    const pattern = `^${checkHttps ? 'https' : 'https?'}:\\/\\/(?:www\\.)?(?:[a-zA-Z0-9_-]+\\.)*${escapedDomain}$`;
    console.log('pattern', pattern)
    const regex = new RegExp(pattern, 'i');
    console.log('compare', regex.test(origin))

    return regex.test(origin);
}
