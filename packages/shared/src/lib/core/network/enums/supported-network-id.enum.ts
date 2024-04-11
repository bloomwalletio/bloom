import { NetworkId } from '../types'
import { ChainId } from './chain-id.enum'
import { NetworkNamespace } from './network-namespace.enum'
import { StardustNetworkName } from './stardust-network-name.enum'

export const SupportedStardustNetworkId: Record<string, NetworkId> = {
    Iota: `${NetworkNamespace.Stardust}:${StardustNetworkName.Iota}`,
    Shimmer: `${NetworkNamespace.Stardust}:${StardustNetworkName.Shimmer}`,
    Testnet: `${NetworkNamespace.Stardust}:${StardustNetworkName.Testnet}`,
}

export const EvmNetworkId: Record<string, NetworkId> = {
    ShimmerEvm: `${NetworkNamespace.Evm}:${ChainId.ShimmerEvm}`,
    TestnetEvm: `${NetworkNamespace.Evm}:${ChainId.TestnetEvm}`,
}

export const SupportedNetworkId = { ...SupportedStardustNetworkId, ...EvmNetworkId }
