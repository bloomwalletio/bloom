import { NetworkName, SupportedNetworkId } from '../enums'
import { NetworkId } from '../types'

export function getNetworkNameFromNetworkId(networkId: NetworkId): NetworkName {
    const nameMap: { [id: NetworkId]: NetworkName } = {
        [SupportedNetworkId.Iota]: NetworkName.Iota,
        [SupportedNetworkId.Shimmer]: NetworkName.Shimmer,
        [SupportedNetworkId.Testnet]: NetworkName.Testnet,
    }

    return nameMap[networkId] ?? NetworkName.Custom
}
