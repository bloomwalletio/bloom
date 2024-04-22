import { cleanUrl, shuffleArray } from '@core/utils'
import { getActiveProfile } from '@core/profile/stores'

export function getSanitizedNftUrls(uri: string | undefined): string[] {
    if (!uri) {
        return []
    }

    try {
        const url = new URL(uri)
        const urls: string[] = []

        switch (url.protocol) {
            case 'http:':
                urls.push(uri.replace('http:', 'https:'))
                break
            case 'https:':
                urls.push(uri)
                break
            case 'ipfs:': {
                const ipfsGateways = getSortedIpfsGateways()
                for (const gateway of ipfsGateways) {
                    const _url = new URL('/ipfs/' + url.pathname.replace('ipfs://', ''), gateway.url)
                    urls.push(_url.href)
                }
                break
            }
            default:
                return []
        }

        return urls.map((url) => cleanUrl(url))
    } catch {
        return []
    }
}

function getSortedIpfsGateways(): { url: string; isPrimary?: boolean }[] {
    const ipfsGateways = getActiveProfile().settings.nfts.ipfsGateways ?? []
    return shuffleArray(ipfsGateways).sort(
        (gateway1, gateway2) => Number(gateway1.isPrimary) - Number(gateway2.isPrimary)
    )
}
