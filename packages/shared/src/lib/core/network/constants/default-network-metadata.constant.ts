import { COIN_TYPE, DEFAULT_BASE_TOKEN, SHIMMER_NETWORK_ID, TESTNET_NETWORK_ID } from '../constants'
import { NetworkNamespace, TangleNetworkId, TokenSupply } from '../enums'
import { IStardustNetworkMetadata } from '../interfaces'
import { NetworkMetadata } from '../types'

// TODO: Should this be reverted back to a object with all metadata for any network (or chain?)
export const DEFAULT_TANGLE_NETWORK_METADATA: Readonly<{ [key in TangleNetworkId]?: NetworkMetadata }> = {
    [TangleNetworkId.Shimmer]: <IStardustNetworkMetadata>{
        id: SHIMMER_NETWORK_ID,
        namespace: NetworkNamespace.Tangle,
        protocolId: TangleNetworkId.Shimmer,
        name: 'Shimmer',
        coinType: COIN_TYPE[SHIMMER_NETWORK_ID],
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
        baseToken: DEFAULT_BASE_TOKEN[SHIMMER_NETWORK_ID],
    },
    [TangleNetworkId.Testnet]: <IStardustNetworkMetadata>{
        id: TESTNET_NETWORK_ID,
        namespace: NetworkNamespace.Tangle,
        protocolId: TangleNetworkId.Testnet,
        name: 'Testnet',
        coinType: COIN_TYPE[TESTNET_NETWORK_ID],
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
        baseToken: DEFAULT_BASE_TOKEN[TESTNET_NETWORK_ID],
    },
}
