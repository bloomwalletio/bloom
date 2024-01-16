const IPFS_GATEWAY = 'ipfs.4everland.io'

export function rewriteIpfsUri(ipfsUri: string): string {
    const url = new URL(ipfsUri)

    return 'https://' + IPFS_GATEWAY + '/ipfs/' + url.pathname.replace('//', '')
}
