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
    Bnb: `${NetworkNamespace.Evm}:${ChainId.Bnb}`,
    BnbTestnet: `${NetworkNamespace.Evm}:${ChainId.BnbTestnet}`,
}

export const SupportedL2EvmNetworkId: Record<string, EvmNetworkId> = {
    Arbitrum: `${NetworkNamespace.Evm}:${ChainId.Arbitrum}`,
    ArbitrumSepoliaTestnet: `${NetworkNamespace.Evm}:${ChainId.ArbitrumSepoliaTestnet}`,
    Base: `${NetworkNamespace.Evm}:${ChainId.Base}`,
    BaseSepoliaTestnet: `${NetworkNamespace.Evm}:${ChainId.BaseSepoliaTestnet}`,
    Blast: `${NetworkNamespace.Evm}:${ChainId.Blast}`,
    BlastSepoliaTestnet: `${NetworkNamespace.Evm}:${ChainId.BlastSepoliaTestnet}`,
    Immutable: `${NetworkNamespace.Evm}:${ChainId.Immutable}`,
    ImmutableTestnet: `${NetworkNamespace.Evm}:${ChainId.ImmutableTestnet}`,
    Optimism: `${NetworkNamespace.Evm}:${ChainId.Optimism}`,
    OptimismSepoliaTestnet: `${NetworkNamespace.Evm}:${ChainId.OptimismSepoliaTestnet}`,
}

export const SupportedNetworkId = {
    ...SupportedStardustNetworkId,
    ...SupportedIscNetworkId,
    ...SupportedL1EvmNetworkId,
    ...SupportedL2EvmNetworkId,
}
