import { SupportedStardustNetworkId } from '../enums'
import { NetworkId } from '../types'

export function getExplorerApiNetworkName(networkId: NetworkId): string {
    switch (networkId) {
        case SupportedStardustNetworkId.Iota:
            return 'mainnet'
        case SupportedStardustNetworkId.Shimmer:
            return 'shimmer'
        case SupportedStardustNetworkId.Testnet:
            return 'testnet'
        default:
            return ''
    }
}
