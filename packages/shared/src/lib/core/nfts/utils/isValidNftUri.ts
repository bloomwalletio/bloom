export function isValidNftUri(uri: string | undefined): boolean {
    try {
        const url = new URL(uri ?? '')
        return ['http:', 'https:', 'ipfs:'].includes(url.protocol)
    } catch {
        return false
    }
}
