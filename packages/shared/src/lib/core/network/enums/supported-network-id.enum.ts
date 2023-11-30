import { EvmChainId } from './evm-chain-id.enum'
import { NetworkNamespace } from './network-namespace.enum'
import { StardustNetworkName } from './stardust-network-name.enum'

export enum StardustNetworkId {
    Iota = `${NetworkNamespace.Stardust}:${StardustNetworkName.Iota}`,
    Shimmer = `${NetworkNamespace.Stardust}:${StardustNetworkName.Shimmer}`,
    Testnet = `${NetworkNamespace.Stardust}:${StardustNetworkName.Testnet}`,
}

export enum EvmNetworkId {
    ShimmerEvm = `${NetworkNamespace.Evm}:${EvmChainId.ShimmerEvm}`,
    TestnetEvm = `${NetworkNamespace.Evm}:${EvmChainId.TestnetEvm}`,
}

export const SupportedNetworkId = { ...StardustNetworkId, ...EvmNetworkId }
export type SupportedNetworkId = (typeof SupportedNetworkId)[keyof typeof SupportedNetworkId]
