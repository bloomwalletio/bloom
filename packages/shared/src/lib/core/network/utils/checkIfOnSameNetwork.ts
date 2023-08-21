export function checkIfOnSameNetwork(
    name: string | undefined,
    clientOptionsNetworkName: string | undefined,
    isDeveloperProfile: boolean
): { locale: string; values?: { [key: string]: string | number } } | undefined {
    if (!name) {
        return { locale: 'error.network.notReachable' }
    } else if (name !== clientOptionsNetworkName && !isDeveloperProfile) {
        return { locale: 'error.network.mismatch', values: { networkId: name } }
    }
}
