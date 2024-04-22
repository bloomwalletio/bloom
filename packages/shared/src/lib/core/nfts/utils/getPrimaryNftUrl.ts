import { getFetchableNftUrls } from './getFetchableNftUrls'

export function getPrimaryNftUrl(uri: string | undefined): string | undefined {
    const sanitizedNftUrl = getFetchableNftUrls(uri)

    return sanitizedNftUrl[0]
}
