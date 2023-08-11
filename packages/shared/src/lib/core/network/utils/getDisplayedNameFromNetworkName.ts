import { NetworkName } from '../enums'

export function getDisplayedNameFromNetworkName(networkId: NetworkName): string {
    switch (networkId) {
        case NetworkName.Iota:
            return 'IOTA'
        case NetworkName.Shimmer:
            return 'Shimmer'
        case NetworkName.Testnet:
            return 'Testnet'
        default:
            return 'Unknown Network'
    }
}
