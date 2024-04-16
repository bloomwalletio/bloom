import { EvmNetworkType, NetworkNamespace, ChainId } from '../enums'
import { IIscpEvmNetworkConfiguration } from '../interfaces'
import { EvmNetworkConfiguration, StardustNetworkId } from '../types'
import { DEFAULT_COIN_TYPE } from './default-coin-type.constant'
import { SupportedIscNetworkId, SupportedNetworkId } from './supported-network-id.constant'

export const DEFAULT_ISC_NETWORK_CONFIGURATIONS_PER_STARDUST_NETWORK: Readonly<{
    [id in StardustNetworkId]?: IIscpEvmNetworkConfiguration[]
}> = {
    [SupportedNetworkId.Shimmer]: [
        {
            id: SupportedIscNetworkId.ShimmerEvm,
            type: EvmNetworkType.Iscp,
            name: 'Shimmer EVM',
            chainId: ChainId.ShimmerEvm,
            namespace: NetworkNamespace.Evm,
            coinType: DEFAULT_COIN_TYPE[SupportedIscNetworkId.ShimmerEvm],
            aliasAddress: 'smr1prxvwqvwf7nru5q5xvh5thwg54zsm2y4wfnk6yk56hj3exxkg92mx20wl3s',
            rpcEndpoint: 'https://json-rpc.evm.shimmer.network/',
            apiEndpoint: 'https://api.evm.shimmer.network/',
            explorerUrl: 'https://explorer.evm.shimmer.network/',
        } as IIscpEvmNetworkConfiguration,
    ],
    [SupportedNetworkId.Testnet]: [
        {
            id: SupportedIscNetworkId.TestnetEvm,
            type: EvmNetworkType.Iscp,
            name: 'Testnet EVM',
            chainId: ChainId.TestnetEvm,
            namespace: NetworkNamespace.Evm,
            coinType: DEFAULT_COIN_TYPE[SupportedIscNetworkId.TestnetEvm],
            aliasAddress: 'rms1ppp00k5mmd2m8my8ukkp58nd3rskw6rx8l09aj35984k74uuc5u2cywn3ex',
            rpcEndpoint: 'https://json-rpc.evm.testnet.shimmer.network/',
            apiEndpoint: 'https://api.evm.testnet.shimmer.network/',
            explorerUrl: 'https://explorer.evm.testnet.shimmer.network/',
        } as IIscpEvmNetworkConfiguration,
        {
            id: SupportedIscNetworkId.TestnetKycEvm,
            type: EvmNetworkType.Iscp,
            name: 'Testnet KYC EVM',
            chainId: ChainId.TestnetKycEvm,
            namespace: NetworkNamespace.Evm,
            coinType: DEFAULT_COIN_TYPE[SupportedIscNetworkId.TestnetKycEvm],
            aliasAddress: 'rms1pqva79scq8k0dz0hdhjvwh0v80pya4z66egruvkssdkxc3fmzy2z60adm9x',
            rpcEndpoint: 'https://fervent-lichterman.dune.spyce5.com/wasp/api/',
            apiEndpoint: 'https://fervent-lichterman.dune.spyce5.com/wasp/api/',
            explorerUrl: undefined,
        } as IIscpEvmNetworkConfiguration,
    ],
}
