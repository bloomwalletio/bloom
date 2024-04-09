export function checkIfOnSameNetwork(
    name: string | undefined,
    clientOptionsNetworkName: string | undefined
): { locale: string; values?: { [key: string]: string | number } } | undefined {
    if (!name) {
        return { locale: 'error.network.notReachable' }
    } else if (name !== clientOptionsNetworkName) {
        return { locale: 'error.network.mismatch', values: { networkId: name } }
    }
}
