import { DestinationNetwork } from '@core/layer-2/enums'

import { COIN_TYPE } from '../constants'
import { EvmChainId, ChainType, SupportedNetworkId } from '../enums'
import { ChainConfiguration, NetworkIdType } from '../types'

export const DEFAULT_CHAIN_CONFIGURATIONS: Readonly<{ [id in NetworkIdType]?: ChainConfiguration }> = {
    [SupportedNetworkId.Shimmer]: {
        type: ChainType.Iscp,
        name: DestinationNetwork.ShimmerEvm,
        networkId: SupportedNetworkId.ShimmerEvm,
        chainId: EvmChainId.ShimmerEvm,
        coinType: COIN_TYPE[SupportedNetworkId.ShimmerEvm],
        aliasAddress: '', // 'rms1pr75wa5xuepg2hew44vnr28wz5h6n6x99zptk2g68sp2wuu2karywgrztx3',
        iscpEndpoint: 'https://json-rpc.evm.shimmer.network',
        explorerUrl: 'https://explorer.evm.shimmer.network',
    },
    [SupportedNetworkId.Testnet]: {
        type: ChainType.Iscp,
        name: DestinationNetwork.ShimmerEvmTestnet,
        networkId: SupportedNetworkId.ShimmerEvmTestnet,
        chainId: EvmChainId.ShimmerEvmTestnet,
        coinType: COIN_TYPE[SupportedNetworkId.ShimmerEvmTestnet],
        aliasAddress: 'rms1pr75wa5xuepg2hew44vnr28wz5h6n6x99zptk2g68sp2wuu2karywgrztx3',
        iscpEndpoint: 'https://json-rpc.evm.testnet.shimmer.network',
        explorerUrl: 'https://explorer.evm.testnet.shimmer.network',
    },
}
