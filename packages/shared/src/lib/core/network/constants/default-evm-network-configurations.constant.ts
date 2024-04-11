import { DEFAULT_COIN_TYPE } from '../constants'
import { EvmNetworkType, NetworkNamespace, SupportedNetworkId, ChainId } from '../enums'
import { IIscpEvmNetworkConfiguration } from '../interfaces'
import { EvmNetworkConfiguration, NetworkId } from '../types'

export const DEFAULT_EVM_NETWORK_CONFIGURATIONS: Readonly<{ [id in NetworkId]?: EvmNetworkConfiguration }> = {
    [SupportedNetworkId.Shimmer]: {
        id: SupportedNetworkId.ShimmerEvm,
        type: EvmNetworkType.Iscp,
        name: 'Shimmer EVM',
        chainId: ChainId.ShimmerEvm,
        namespace: NetworkNamespace.Evm,
        coinType: DEFAULT_COIN_TYPE[SupportedNetworkId.ShimmerEvm],
        aliasAddress: 'smr1prxvwqvwf7nru5q5xvh5thwg54zsm2y4wfnk6yk56hj3exxkg92mx20wl3s',
        rpcEndpoint: 'https://json-rpc.evm.shimmer.network/',
        apiEndpoint: 'https://api.evm.shimmer.network/',
        explorerUrl: 'https://explorer.evm.shimmer.network/',
    } as IIscpEvmNetworkConfiguration,
    [SupportedNetworkId.Testnet]: {
        id: SupportedNetworkId.TestnetEvm,
        type: EvmNetworkType.Iscp,
        name: 'Testnet EVM',
        chainId: ChainId.TestnetEvm,
        namespace: NetworkNamespace.Evm,
        coinType: DEFAULT_COIN_TYPE[SupportedNetworkId.TestnetEvm],
        aliasAddress: 'rms1ppp00k5mmd2m8my8ukkp58nd3rskw6rx8l09aj35984k74uuc5u2cywn3ex',
        rpcEndpoint: 'https://json-rpc.evm.testnet.shimmer.network/',
        apiEndpoint: 'https://api.evm.testnet.shimmer.network/',
        explorerUrl: 'https://explorer.evm.testnet.shimmer.network/',
    } as IIscpEvmNetworkConfiguration,
}
