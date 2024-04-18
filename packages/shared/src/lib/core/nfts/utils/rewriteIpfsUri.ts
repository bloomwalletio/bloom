import { getActiveProfile } from '@core/profile/stores'

export function rewriteIpfsUri(ipfsUri: string): string {
    const ipfsGateway = getActiveProfile().settings.nfts.ipfsGateways?.filter((gateway) => gateway.isPrimary)[0]?.url
    const url = new URL(ipfsUri)

    return ipfsGateway + '/' + url.pathname.replace('//', '')
}
