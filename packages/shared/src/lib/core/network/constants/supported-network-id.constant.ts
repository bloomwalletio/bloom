import { EvmNetworkId, StardustNetworkId } from '../types'
import { ChainId } from '../enums/chain-id.enum'
import { NetworkNamespace } from '../enums/network-namespace.enum'
import { StardustNetworkName } from '../enums/stardust-network-name.enum'

export const SupportedStardustNetworkId: Record<string, StardustNetworkId> = {
    Iota: `${NetworkNamespace.Stardust}:${StardustNetworkName.Iota}`,
    Shimmer: `${NetworkNamespace.Stardust}:${StardustNetworkName.Shimmer}`,
    Testnet: `${NetworkNamespace.Stardust}:${StardustNetworkName.Testnet}`,
}

export const SupportedL1EvmNetworkId: Record<string, EvmNetworkId> = {
    Ethereum: `${NetworkNamespace.Evm}:${ChainId.Ethereum}`,
    Sepolia: `${NetworkNamespace.Evm}:${ChainId.Sepolia}`,
}

export const SupportedIscNetworkId: Record<string, EvmNetworkId> = {
    ShimmerEvm: `${NetworkNamespace.Evm}:${ChainId.ShimmerEvm}`,
    TestnetEvm: `${NetworkNamespace.Evm}:${ChainId.TestnetEvm}`,
}

export const SupportedNetworkId = { ...SupportedStardustNetworkId, ...SupportedIscNetworkId }
