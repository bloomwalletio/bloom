import { getActiveProfile } from '@core/profile/stores'

export function rewriteIpfsUri(ipfsUri: string): string {
    const ipfsGateway = getActiveProfile().settings.nfts.ipfsGateway
    const url = new URL(ipfsUri)

    return ipfsGateway + url.pathname.replace('//', '')
}
