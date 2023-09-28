export function isValidWalletConnectVersion(uri: string): boolean {
    const url = new URL(uri)

    return url.pathname.split('@')?.[1] === '2'
}
