import type { EvmNetworkId, StardustNetworkId } from '../types/network-id.type'
import { ChainId } from '../enums/chain-id.enum'
import { NetworkNamespace } from '../enums/network-namespace.enum'
import { StardustNetworkName } from '../enums/stardust-network-name.enum'

export const SupportedStardustNetworkId: Record<string, StardustNetworkId> = {
    Iota: `${NetworkNamespace.Stardust}:${StardustNetworkName.Iota}`,
    Shimmer: `${NetworkNamespace.Stardust}:${StardustNetworkName.Shimmer}`,
    Testnet: `${NetworkNamespace.Stardust}:${StardustNetworkName.Testnet}`,
    IotaTestnet: `${NetworkNamespace.Stardust}:${StardustNetworkName.IotaTestnet}`,
}

export const SupportedIscNetworkId: Record<string, EvmNetworkId> = {
    IotaEvm: `${NetworkNamespace.Evm}:${ChainId.IotaEvm}`,
    ShimmerEvm: `${NetworkNamespace.Evm}:${ChainId.ShimmerEvm}`,
    TestnetEvm: `${NetworkNamespace.Evm}:${ChainId.TestnetEvm}`,
    IotaTestnetEvm: `${NetworkNamespace.Evm}:${ChainId.IotaTestnetEvm}`,
}

export const SupportedL1EvmNetworkId: Record<string, EvmNetworkId> = {
    GenericEvm: `${NetworkNamespace.Evm}:*`,
    Ethereum: `${NetworkNamespace.Evm}:${ChainId.Ethereum}`,
    Sepolia: `${NetworkNamespace.Evm}:${ChainId.Sepolia}`,
}

export const SupportedL2EvmNetworkId: Record<string, EvmNetworkId> = {
    Optimism: `${NetworkNamespace.Evm}:${ChainId.Optimism}`,
    Blast: `${NetworkNamespace.Evm}:${ChainId.Blast}`,
    Base: `${NetworkNamespace.Evm}:${ChainId.Base}`,
    Immutable: `${NetworkNamespace.Evm}:${ChainId.Immutable}`,
    Arbitrum: `${NetworkNamespace.Evm}:${ChainId.Arbitrum}`,
}

export const SupportedNetworkId = {
    ...SupportedStardustNetworkId,
    ...SupportedIscNetworkId,
    ...SupportedL1EvmNetworkId,
    ...SupportedL2EvmNetworkId,
}
