import { SupportedNetworkId } from '../enums'
import { NetworkId } from '../types'

export function getDisplayedNameFromNetworkId(networkId: NetworkId): string {
    switch (networkId) {
        case SupportedNetworkId.Shimmer:
            return 'Shimmer'
        case SupportedNetworkId.Testnet:
            return 'Testnet'
        default:
            return 'Unknown Network'
    }
}
