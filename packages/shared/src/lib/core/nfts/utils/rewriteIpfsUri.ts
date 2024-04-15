import { IPFS_GATEWAYS } from '../constants'

export function rewriteIpfsUri(ipfsUri: string): string {
    const url = new URL(ipfsUri)

    return IPFS_GATEWAYS[0] + url.pathname.replace('//', '')
}
