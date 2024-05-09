import { EvmNetworkId, StardustNetworkId } from '../types'
import { ChainId } from '../enums/chain-id.enum'
import { NetworkNamespace } from '../enums/network-namespace.enum'
import { StardustNetworkName } from '../enums/stardust-network-name.enum'

export const SupportedStardustNetworkId: Record<string, StardustNetworkId> = {
    Iota: `${NetworkNamespace.Stardust}:${StardustNetworkName.Iota}`,
    Shimmer: `${NetworkNamespace.Stardust}:${StardustNetworkName.Shimmer}`,
    Testnet: `${NetworkNamespace.Stardust}:${StardustNetworkName.Testnet}`,
    IotaTestnet: `${NetworkNamespace.Stardust}:${StardustNetworkName.IotaTestnet}`,
}

export const SupportedL1EvmNetworkId: Record<string, EvmNetworkId> = {
    Ethereum: `${NetworkNamespace.Evm}:${ChainId.Ethereum}`,
    Sepolia: `${NetworkNamespace.Evm}:${ChainId.Sepolia}`,
}

export const SupportedIscNetworkId: Record<string, EvmNetworkId> = {
    IotaEvm: `${NetworkNamespace.Evm}:${ChainId.IotaEvm}`,
    ShimmerEvm: `${NetworkNamespace.Evm}:${ChainId.ShimmerEvm}`,
    TestnetEvm: `${NetworkNamespace.Evm}:${ChainId.TestnetEvm}`,
    IotaTestnetEvm: `${NetworkNamespace.Evm}:${ChainId.IotaTestnetEvm}`,
}

export const SupportedNetworkId = {
    ...SupportedStardustNetworkId,
    ...SupportedIscNetworkId,
    ...SupportedL1EvmNetworkId,
}
