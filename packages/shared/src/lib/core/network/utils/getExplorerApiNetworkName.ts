import { StardustNetworkId } from '../enums'
import { NetworkId } from '../types'

export function getExplorerApiNetworkName(networkId: NetworkId): string {
    switch (networkId) {
        case StardustNetworkId.Iota:
            return 'mainnet'
        case StardustNetworkId.Shimmer:
            return 'shimmer'
        case StardustNetworkId.Testnet:
            return 'testnet'
        default:
            return ''
    }
}
