import { DEFAULT_COIN_TYPE, DEFAULT_BASE_TOKEN } from '../constants'
import { NetworkNamespace, SupportedNetworkId, StardustNetworkName, TokenSupply } from '../enums'
import { IStardustNetworkMetadata } from '../interfaces'
import { NetworkId, NetworkMetadata } from '../types'

// TODO: Should this be reverted back to a object with all metadata for any network (or chain?)
export const DEFAULT_NETWORK_METADATA: Readonly<{ [key in NetworkId]?: NetworkMetadata }> = {
    [SupportedNetworkId.Iota]: <IStardustNetworkMetadata>{
        id: SupportedNetworkId.Iota,
        name: 'Iota',
        networkName: StardustNetworkName.Iota,
        namespace: NetworkNamespace.Stardust,
        coinType: DEFAULT_COIN_TYPE[SupportedNetworkId.Iota],
        protocol: {
            version: 2,
            networkName: 'iota-mainnet',
            bech32Hrp: 'iota',
            minPowScore: 1500,
            belowMaxDepth: 15,
            rentStructure: {
                vByteCost: 100,
                vByteFactorData: 1,
                vByteFactorKey: 10,
            },
            tokenSupply: TokenSupply.Iota,
        },
        baseToken: DEFAULT_BASE_TOKEN[SupportedNetworkId.Shimmer],
    },
    [SupportedNetworkId.Shimmer]: <IStardustNetworkMetadata>{
        id: SupportedNetworkId.Shimmer,
        name: 'Shimmer',
        networkName: StardustNetworkName.Shimmer,
        namespace: NetworkNamespace.Stardust,
        coinType: DEFAULT_COIN_TYPE[SupportedNetworkId.Shimmer],
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
        name: 'Testnet',
        networkName: StardustNetworkName.Testnet,
        namespace: NetworkNamespace.Stardust,
        coinType: DEFAULT_COIN_TYPE[SupportedNetworkId.Testnet],
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
