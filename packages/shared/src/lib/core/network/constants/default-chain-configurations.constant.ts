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
        aliasAddress: 'smr1prxvwqvwf7nru5q5xvh5thwg54zsm2y4wfnk6yk56hj3exxkg92mx20wl3s',
        iscpEndpoint: 'https://json-rpc.evm.shimmer.network/',
        explorerUrl: 'https://explorer.evm.shimmer.network/',
    },
    [SupportedNetworkId.Testnet]: {
        id: SupportedNetworkId.ShimmerEvmTestnet,
        type: ChainType.Iscp,
        name: 'ShimmerEVM Testnet',
        chainId: EvmChainId.ShimmerEvmTestnet,
        namespace: NetworkNamespace.Evm,
        coinType: DEFAULT_COIN_TYPE[SupportedNetworkId.ShimmerEvmTestnet],
        aliasAddress: 'rms1ppp00k5mmd2m8my8ukkp58nd3rskw6rx8l09aj35984k74uuc5u2cywn3ex',
        iscpEndpoint: 'https://json-rpc.evm.testnet.shimmer.network/',
        explorerUrl: 'https://explorer.evm.testnet.shimmer.network/',
    },
}
