import { IPFS_GATEWAY } from '../constants'

export function rewriteIpfsUri(ipfsUri: string): string {
    const url = new URL(ipfsUri)

    return IPFS_GATEWAY + url.pathname.replace('//', '')
}
