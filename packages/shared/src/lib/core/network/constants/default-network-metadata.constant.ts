import { NetworkNamespace, StardustNetworkName } from '../enums'
import { IStardustNetworkMetadata } from '../interfaces'
import { NetworkMetadata, StardustNetworkId } from '../types'
import { DEFAULT_BASE_TOKEN } from './default-base-token.constant'
import { DEFAULT_COIN_TYPE } from './default-coin-type.constant'
import { DEFAULT_PROTOCOL } from './default-protocol.constant'
import { SupportedNetworkId } from './supported-network-id.constant'

// TODO: Should this be reverted back to a object with all metadata for any network (or evmNetwork?)
export const DEFAULT_NETWORK_METADATA: Readonly<{ [key in StardustNetworkId]?: NetworkMetadata }> = {
    [SupportedNetworkId.Iota]: <IStardustNetworkMetadata>{
        id: SupportedNetworkId.Iota,
        name: 'IOTA',
        networkName: StardustNetworkName.Iota,
        namespace: NetworkNamespace.Stardust,
        coinType: DEFAULT_COIN_TYPE[SupportedNetworkId.Iota],
        protocol: DEFAULT_PROTOCOL[SupportedNetworkId.Iota],
        baseToken: DEFAULT_BASE_TOKEN[SupportedNetworkId.Iota],
    },
    [SupportedNetworkId.Shimmer]: <IStardustNetworkMetadata>{
        id: SupportedNetworkId.Shimmer,
        name: 'Shimmer',
        networkName: StardustNetworkName.Shimmer,
        namespace: NetworkNamespace.Stardust,
        coinType: DEFAULT_COIN_TYPE[SupportedNetworkId.Shimmer],
        protocol: DEFAULT_PROTOCOL[SupportedNetworkId.Shimmer],
        baseToken: DEFAULT_BASE_TOKEN[SupportedNetworkId.Shimmer],
    },
    [SupportedNetworkId.Testnet]: <IStardustNetworkMetadata>{
        id: SupportedNetworkId.Testnet,
        name: 'Testnet',
        networkName: StardustNetworkName.Testnet,
        namespace: NetworkNamespace.Stardust,
        coinType: DEFAULT_COIN_TYPE[SupportedNetworkId.Testnet],
        protocol: DEFAULT_PROTOCOL[SupportedNetworkId.Testnet],
        baseToken: DEFAULT_BASE_TOKEN[SupportedNetworkId.Testnet],
    },
}
