import { EvmNetworkType, NetworkNamespace, ChainId } from '../enums'
import { IIscChainConfiguration } from '../interfaces'
import { StardustNetworkId } from '../types'
import { DEFAULT_COIN_TYPE } from './default-coin-type.constant'
import { SupportedIscNetworkId, SupportedNetworkId, SupportedStardustNetworkId } from './supported-network-id.constant'

export const DEFAULT_ISC_CHAINS_CONFIGURATIONS: Readonly<{ [id in StardustNetworkId]?: IIscChainConfiguration }> = {
    [SupportedStardustNetworkId.Shimmer]: {
        id: SupportedIscNetworkId.ShimmerEvm,
        type: EvmNetworkType.Isc,
        name: 'Shimmer EVM',
        chainId: ChainId.ShimmerEvm,
        namespace: NetworkNamespace.Evm,
        coinType: DEFAULT_COIN_TYPE[SupportedNetworkId.ShimmerEvm] ?? 0,
        aliasAddress: 'smr1prxvwqvwf7nru5q5xvh5thwg54zsm2y4wfnk6yk56hj3exxkg92mx20wl3s',
        rpcEndpoint: 'https://json-rpc.evm.shimmer.network/',
        apiEndpoint: 'https://api.evm.shimmer.network/',
        explorerUrl: 'https://explorer.evm.shimmer.network/',
    },
    [SupportedStardustNetworkId.Testnet]: {
        id: SupportedIscNetworkId.TestnetEvm,
        type: EvmNetworkType.Isc,
        name: 'Testnet EVM',
        chainId: ChainId.TestnetEvm,
        namespace: NetworkNamespace.Evm,
        coinType: DEFAULT_COIN_TYPE[SupportedNetworkId.TestnetEvm] ?? 0,
        aliasAddress: 'rms1ppp00k5mmd2m8my8ukkp58nd3rskw6rx8l09aj35984k74uuc5u2cywn3ex',
        rpcEndpoint: 'https://json-rpc.evm.testnet.shimmer.network/',
        apiEndpoint: 'https://api.evm.testnet.shimmer.network/',
        explorerUrl: 'https://explorer.evm.testnet.shimmer.network/',
    },
}
