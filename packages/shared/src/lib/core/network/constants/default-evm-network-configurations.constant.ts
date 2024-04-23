import { EvmNetworkType, NetworkNamespace, ChainId } from '../enums'
import { IIscChainConfiguration } from '../interfaces'
import { StardustNetworkId } from '../types'
import { DEFAULT_COIN_TYPE } from './default-coin-type.constant'
import { SupportedNetworkId } from './supported-network-id.constant'

export const DEFAULT_EVM_NETWORK_CONFIGURATIONS: Readonly<{ [id in StardustNetworkId]?: IIscChainConfiguration }> = {
    [SupportedNetworkId.Iota]: {
        id: SupportedNetworkId.IotaEvm,
        type: EvmNetworkType.Isc,
        name: 'IOTA EVM',
        chainId: ChainId.IotaEvm,
        namespace: NetworkNamespace.Evm,
        coinType: DEFAULT_COIN_TYPE[SupportedNetworkId.IotaEvm],
        aliasAddress: 'iota1pzt3mstq6khgc3tl0mwuzk3eqddkryqnpdxmk4nr25re2466uxwm28qqxu5',
        rpcEndpoint: 'https://json-rpc.evm.iotaledger.net/',
        apiEndpoint: 'https://api.evm.iotaledger.net/',
        explorerUrl: 'https://iota-evm.blockscout.com/',
    } as IIscChainConfiguration,
    [SupportedNetworkId.Shimmer]: {
        id: SupportedNetworkId.ShimmerEvm,
        type: EvmNetworkType.Isc,
        name: 'Shimmer EVM',
        chainId: ChainId.ShimmerEvm,
        namespace: NetworkNamespace.Evm,
        coinType: DEFAULT_COIN_TYPE[SupportedNetworkId.ShimmerEvm],
        aliasAddress: 'smr1prxvwqvwf7nru5q5xvh5thwg54zsm2y4wfnk6yk56hj3exxkg92mx20wl3s',
        rpcEndpoint: 'https://json-rpc.evm.shimmer.network/',
        apiEndpoint: 'https://api.evm.shimmer.network/',
        explorerUrl: 'https://explorer.evm.shimmer.network/',
    } as IIscChainConfiguration,
    [SupportedNetworkId.Testnet]: {
        id: SupportedNetworkId.TestnetEvm,
        type: EvmNetworkType.Isc,
        name: 'Testnet EVM',
        chainId: ChainId.TestnetEvm,
        namespace: NetworkNamespace.Evm,
        coinType: DEFAULT_COIN_TYPE[SupportedNetworkId.TestnetEvm],
        aliasAddress: 'rms1ppp00k5mmd2m8my8ukkp58nd3rskw6rx8l09aj35984k74uuc5u2cywn3ex',
        rpcEndpoint: 'https://json-rpc.evm.testnet.shimmer.network/',
        apiEndpoint: 'https://api.evm.testnet.shimmer.network/',
        explorerUrl: 'https://explorer.evm.testnet.shimmer.network/',
    } as IIscChainConfiguration,
}
