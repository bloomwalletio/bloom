import { DEFAULT_COIN_TYPE } from '../constants'
import { EvmChainId, ChainType, SupportedNetworkId, NetworkNamespace } from '../enums'
import { ChainConfiguration, NetworkId } from '../types'

export const DEFAULT_CHAIN_CONFIGURATIONS: Readonly<{ [id in NetworkId]?: ChainConfiguration }> = {
    [SupportedNetworkId.Shimmer]: {
        id: SupportedNetworkId.ShimmerEvm,
        type: ChainType.Iscp,
        name: 'ShimmerEVM',
        chainId: EvmChainId.ShimmerEvm,
        namespace: NetworkNamespace.Evm,
        coinType: DEFAULT_COIN_TYPE[SupportedNetworkId.ShimmerEvm],
        aliasAddress: 'rms1ppnkvsjctdg53v2x89uzhuxg89s073jmn2nuzcw44tggjy8rzzgzq2rg0qp',
        iscpEndpoint: 'https://json-rpc.evm.shimmer.network',
        explorerUrl: 'https://explorer.evm.shimmer.network',
    },
    [SupportedNetworkId.Testnet]: {
        id: SupportedNetworkId.ShimmerEvmTestnet,
        type: ChainType.Iscp,
        name: 'ShimmerEVM Testnet',
        chainId: EvmChainId.ShimmerEvmTestnet,
        namespace: NetworkNamespace.Evm,
        coinType: DEFAULT_COIN_TYPE[SupportedNetworkId.ShimmerEvmTestnet],
        aliasAddress: 'rms1pr75wa5xuepg2hew44vnr28wz5h6n6x99zptk2g68sp2wuu2karywgrztx3',
        iscpEndpoint: 'https://json-rpc.evm.testnet.shimmer.network',
        explorerUrl: 'https://explorer.evm.testnet.shimmer.network',
    },
}
