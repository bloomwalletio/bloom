import { NetworkType, NetworkNamespace, ChainId } from '../enums'
import { IIscChainConfiguration } from '../interfaces'
import { StardustNetworkId } from '../types'
import { DEFAULT_BASE_TOKEN } from './default-base-token.constant'
import { DEFAULT_COIN_TYPE } from './default-coin-type.constant'
import { SupportedIscNetworkId, SupportedNetworkId, SupportedStardustNetworkId } from './supported-network-id.constant'
import { isFeatureEnabled } from '@lib/features/utils'

const IOTA_EVM_CHAIN_CONFIGURATION: IIscChainConfiguration = {
    id: SupportedIscNetworkId.IotaEvm,
    type: NetworkType.Isc,
    name: 'IOTA EVM',
    chainId: ChainId.IotaEvm,
    namespace: NetworkNamespace.Evm,
    baseToken: DEFAULT_BASE_TOKEN[SupportedNetworkId.IotaEvm],
    coinType: DEFAULT_COIN_TYPE[SupportedNetworkId.IotaEvm],
    aliasAddress:
        'https://github.com/bloomwalletio/bloom-private/pull/17/files#diff-2e95221dbfb375be5e97b45bad40479c2b3f9a70efa14e66caa1b7fe37df8296',
    rpcEndpoint:
        'https://github.com/bloomwalletio/bloom-private/pull/17/files#diff-2e95221dbfb375be5e97b45bad40479c2b3f9a70efa14e66caa1b7fe37df8296',
    apiEndpoint:
        'https://github.com/bloomwalletio/bloom-private/pull/17/files#diff-2e95221dbfb375be5e97b45bad40479c2b3f9a70efa14e66caa1b7fe37df8296',
    explorerUrl:
        'https://github.com/bloomwalletio/bloom-private/pull/17/files#diff-2e95221dbfb375be5e97b45bad40479c2b3f9a70efa14e66caa1b7fe37df8296',
}

const SHIMMER_EVM_CHAIN_CONFIGURATION: IIscChainConfiguration = {
    id: SupportedIscNetworkId.ShimmerEvm,
    type: NetworkType.Isc,
    name: 'Shimmer EVM',
    chainId: ChainId.ShimmerEvm,
    namespace: NetworkNamespace.Evm,
    baseToken: DEFAULT_BASE_TOKEN[SupportedNetworkId.ShimmerEVM],
    coinType: DEFAULT_COIN_TYPE[SupportedNetworkId.ShimmerEvm] ?? 0,
    aliasAddress: 'smr1prxvwqvwf7nru5q5xvh5thwg54zsm2y4wfnk6yk56hj3exxkg92mx20wl3s',
    rpcEndpoint: 'https://json-rpc.evm.shimmer.network/',
    apiEndpoint: 'https://api.evm.shimmer.network/',
    explorerUrl: 'https://explorer.evm.shimmer.network/',
}

// exported as used in tests
export const TESTNET_EVM_CHAIN_CONFIGURATION: IIscChainConfiguration = {
    id: SupportedIscNetworkId.TestnetEvm,
    type: NetworkType.Isc,
    name: 'Testnet EVM',
    chainId: ChainId.TestnetEvm,
    namespace: NetworkNamespace.Evm,
    baseToken: DEFAULT_BASE_TOKEN[SupportedNetworkId.TestnetEvm],
    coinType: DEFAULT_COIN_TYPE[SupportedNetworkId.TestnetEvm] ?? 0,
    aliasAddress: 'rms1ppp00k5mmd2m8my8ukkp58nd3rskw6rx8l09aj35984k74uuc5u2cywn3ex',
    rpcEndpoint: 'https://json-rpc.evm.testnet.shimmer.network/',
    apiEndpoint: 'https://api.evm.testnet.shimmer.network/',
    explorerUrl: 'https://explorer.evm.testnet.shimmer.network/',
}

export const DEFAULT_ISC_CHAINS_CONFIGURATIONS: Readonly<{ [id in StardustNetworkId]?: IIscChainConfiguration }> = {
    ...(isFeatureEnabled('onboarding.iota.defaultIscChains') && {
        [SupportedStardustNetworkId.Iota]: IOTA_EVM_CHAIN_CONFIGURATION,
    }),
    ...(isFeatureEnabled('onboarding.shimmer.defaultIscChains') && {
        [SupportedStardustNetworkId.Shimmer]: SHIMMER_EVM_CHAIN_CONFIGURATION,
    }),
    ...(isFeatureEnabled('onboarding.testnet.defaultIscChains') && {
        [SupportedStardustNetworkId.Testnet]: TESTNET_EVM_CHAIN_CONFIGURATION,
    }),
}
