import { DestinationNetwork } from '@core/layer-2/enums'

import { ETH_COIN_TYPE } from '../constants'
import { EvmChainId, ChainType, NetworkId } from '../enums'
import { ChainConfiguration } from '../types'

export const DEFAULT_CHAIN_CONFIGURATIONS: Readonly<{ [id in NetworkId]?: ChainConfiguration }> = {
    [NetworkId.Shimmer]: {
        type: ChainType.Iscp,
        name: DestinationNetwork.ShimmerEvm,
        chainId: EvmChainId.ShimmerEvm,
        coinType: ETH_COIN_TYPE,
        aliasAddress: '', // 'rms1pr75wa5xuepg2hew44vnr28wz5h6n6x99zptk2g68sp2wuu2karywgrztx3',
        iscpEndpoint: 'https://json-rpc.evm.shimmer.network',
        explorerUrl: 'https://explorer.evm.shimmer.network',
    },
    [NetworkId.Testnet]: {
        type: ChainType.Iscp,
        name: DestinationNetwork.ShimmerEvmTestnet,
        chainId: EvmChainId.ShimmerEvmTestnet,
        coinType: ETH_COIN_TYPE,
        aliasAddress: 'rms1pr75wa5xuepg2hew44vnr28wz5h6n6x99zptk2g68sp2wuu2karywgrztx3',
        iscpEndpoint: 'https://json-rpc.evm.testnet.shimmer.network',
        explorerUrl: 'https://explorer.evm.testnet.shimmer.network',
    },
}
