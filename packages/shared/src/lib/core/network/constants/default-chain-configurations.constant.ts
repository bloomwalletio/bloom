import { DestinationNetwork } from '@core/layer-2/enums'

import { COIN_TYPE } from '../constants'
import { EvmChainId, ChainType, SupportedNetworkId, NetworkNamespace } from '../enums'
import { ChainConfiguration, NetworkId } from '../types'

export const DEFAULT_CHAIN_CONFIGURATIONS: Readonly<{ [id in NetworkId]?: ChainConfiguration }> = {
    [SupportedNetworkId.Shimmer]: {
        id: SupportedNetworkId.ShimmerEvm,
        type: ChainType.Iscp,
        name: DestinationNetwork.ShimmerEvm,
        chainId: EvmChainId.ShimmerEvm,
        namespace: NetworkNamespace.Evm,
        coinType: COIN_TYPE[SupportedNetworkId.ShimmerEvm],
        aliasAddress: '', // 'rms1pr75wa5xuepg2hew44vnr28wz5h6n6x99zptk2g68sp2wuu2karywgrztx3',
        iscpEndpoint: 'https://json-rpc.evm.shimmer.network',
        explorerUrl: 'https://explorer.evm.shimmer.network',
    },
    [SupportedNetworkId.Testnet]: {
        id: SupportedNetworkId.ShimmerEvmTestnet,
        type: ChainType.Iscp,
        name: DestinationNetwork.ShimmerEvmTestnet,
        chainId: EvmChainId.ShimmerEvmTestnet,
        namespace: NetworkNamespace.Evm,
        coinType: COIN_TYPE[SupportedNetworkId.ShimmerEvmTestnet],
        aliasAddress: 'rms1pr75wa5xuepg2hew44vnr28wz5h6n6x99zptk2g68sp2wuu2karywgrztx3',
        iscpEndpoint: 'https://json-rpc.evm.testnet.shimmer.network',
        explorerUrl: 'https://explorer.evm.testnet.shimmer.network',
    },
}
