import { StardustNetworkId } from '../enums'

export function getExplorerApiNetworkName(networkId: StardustNetworkId): string {
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
