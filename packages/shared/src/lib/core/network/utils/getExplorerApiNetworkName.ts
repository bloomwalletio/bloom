import { SupportedStardustNetworkId } from '../constants'
import { NetworkId } from '../types'

export function getExplorerApiNetworkName(networkId: NetworkId): string {
    switch (networkId) {
        case SupportedStardustNetworkId.Iota:
            return 'mainnet'
        case SupportedStardustNetworkId.Shimmer:
            return 'shimmer'
        case SupportedStardustNetworkId.IotaTestnet:
            return 'iota-testnet'
        case SupportedStardustNetworkId.Testnet:
            return 'testnet'
        default:
            return ''
    }
}
