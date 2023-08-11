import { NetworkName, SupportedNetworkId } from '../enums'
import { NetworkIdType } from '../types'

export function getNetworkNameFromNetworkId(networkId: NetworkIdType): NetworkName {
    const nameMap: { [id: NetworkIdType]: NetworkName } = {
        [SupportedNetworkId.Iota]: NetworkName.Iota,
        [SupportedNetworkId.Shimmer]: NetworkName.Shimmer,
        [SupportedNetworkId.Testnet]: NetworkName.Testnet,
    }

    return nameMap[networkId] ?? NetworkName.Custom
}
