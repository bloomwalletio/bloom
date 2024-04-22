import { getSanitizedNftUrls } from './getSanitizedNftUrls'

export function getPrimaryNftUrl(uri: string | undefined): string | undefined {
    const sanitizedNftUrl = getSanitizedNftUrls(uri)

    return sanitizedNftUrl[0]
}
