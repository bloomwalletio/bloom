import { cleanUrl, shuffleArray } from '@core/utils'
import { getActiveProfile } from '@core/profile/stores'

export function getFetchableNftUrls(uri: string | undefined): string[] {
    if (!uri) {
        return []
    }

    try {
        const url = new URL(uri)

        switch (url.protocol) {
            case 'http:':
                return [cleanUrl(uri.replace('http:', 'https:'))]
            case 'https:':
                return [cleanUrl(uri)]
            case 'ipfs:': {
                const ipfsGateways = getSortedIpfsGateways()
                const urls: string[] = []
                for (const gateway of ipfsGateways) {
                    const _url = new URL('/ipfs/' + url.pathname.replace('//', ''), gateway.url)
                    urls.push(_url.href)
                }
                return urls.map((url) => cleanUrl(url))
            }
            default:
                return []
        }
    } catch {
        return []
    }
}

function getSortedIpfsGateways(): { url: string; isPrimary?: boolean }[] {
    const ipfsGateways = getActiveProfile().settings.nfts.ipfsGateways ?? []
    return shuffleArray(ipfsGateways).sort(
        (gateway1, gateway2) => Number(gateway2.isPrimary) - Number(gateway1.isPrimary)
    )
}
