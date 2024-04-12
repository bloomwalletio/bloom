import { EvmNetworkId, StardustNetworkId } from '../types'
import { ChainId } from '../enums/chain-id.enum'
import { NetworkNamespace } from '../enums/network-namespace.enum'
import { StardustNetworkName } from '../enums/stardust-network-name.enum'

export const SupportedStardustNetworkId: Record<string, StardustNetworkId> = {
    Iota: `${NetworkNamespace.Stardust}:${StardustNetworkName.Iota}`,
    Shimmer: `${NetworkNamespace.Stardust}:${StardustNetworkName.Shimmer}`,
    Testnet: `${NetworkNamespace.Stardust}:${StardustNetworkName.Testnet}`,
}

export const SupportedEvmNetworkId: Record<string, EvmNetworkId> = {
    ShimmerEvm: `${NetworkNamespace.Evm}:${ChainId.ShimmerEvm}`,
    TestnetEvm: `${NetworkNamespace.Evm}:${ChainId.TestnetEvm}`,
    TestnetKycEvm: `${NetworkNamespace.Evm}:${ChainId.TestnetKycEvm}`,
}

export const SupportedNetworkId = { ...SupportedStardustNetworkId, ...SupportedEvmNetworkId }
