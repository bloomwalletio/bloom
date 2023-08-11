import { NetworkName } from '../enums'

export function getDisplayedNameFromNetworkName(networkName: NetworkName): string {
    switch (networkName) {
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
