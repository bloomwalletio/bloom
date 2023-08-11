import { COIN_TYPE, DEFAULT_BASE_TOKEN } from '../constants'
import { NetworkNamespace, SupportedNetworkId, TokenSupply } from '../enums'
import { IStardustNetworkMetadata } from '../interfaces'
import { NetworkIdType, NetworkMetadata } from '../types'

// TODO: Should this be reverted back to a object with all metadata for any network (or chain?)
export const DEFAULT_TANGLE_NETWORK_METADATA: Readonly<{ [key in NetworkIdType]?: NetworkMetadata }> = {
    [SupportedNetworkId.Shimmer]: <IStardustNetworkMetadata>{
        id: SupportedNetworkId.Shimmer,
        namespace: NetworkNamespace.Tangle,
        protocolId: SupportedNetworkId.Shimmer,
        name: 'Shimmer',
        coinType: COIN_TYPE[SupportedNetworkId.Shimmer],
        protocol: {
            version: 2,
            networkName: 'shimmer',
            bech32Hrp: 'smr',
            minPowScore: 1500,
            belowMaxDepth: 15,
            rentStructure: {
                vByteCost: 100,
                vByteFactorData: 1,
                vByteFactorKey: 10,
            },
            tokenSupply: TokenSupply.Shimmer,
        },
        baseToken: DEFAULT_BASE_TOKEN[SupportedNetworkId.Shimmer],
    },
    [SupportedNetworkId.Testnet]: <IStardustNetworkMetadata>{
        id: SupportedNetworkId.Testnet,
        namespace: NetworkNamespace.Tangle,
        protocolId: SupportedNetworkId.Testnet,
        name: 'Testnet',
        coinType: COIN_TYPE[SupportedNetworkId.Testnet],
        protocol: {
            version: 2,
            networkName: 'testnet',
            bech32Hrp: 'rms',
            minPowScore: 1500,
            belowMaxDepth: 15,
            rentStructure: {
                vByteCost: 100,
                vByteFactorData: 1,
                vByteFactorKey: 10,
            },
            tokenSupply: TokenSupply.Testnet,
        },
        baseToken: DEFAULT_BASE_TOKEN[SupportedNetworkId.Testnet],
    },
}
