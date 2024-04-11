import { EvmNetworkId, StardustNetworkId } from '../types'
import { ChainId } from './chain-id.enum'
import { NetworkNamespace } from './network-namespace.enum'
import { StardustNetworkName } from './stardust-network-name.enum'

export const SupportedStardustNetworkId: Record<string, StardustNetworkId> = {
    Iota: `${NetworkNamespace.Stardust}:${StardustNetworkName.Iota}`,
    Shimmer: `${NetworkNamespace.Stardust}:${StardustNetworkName.Shimmer}`,
    Testnet: `${NetworkNamespace.Stardust}:${StardustNetworkName.Testnet}`,
}

export const SupportedEvmNetworkId: Record<string, EvmNetworkId> = {
    ShimmerEvm: `${NetworkNamespace.Evm}:${ChainId.ShimmerEvm}`,
    TestnetEvm: `${NetworkNamespace.Evm}:${ChainId.TestnetEvm}`,
}

export const SupportedNetworkId = { ...SupportedStardustNetworkId, ...SupportedEvmNetworkId }
