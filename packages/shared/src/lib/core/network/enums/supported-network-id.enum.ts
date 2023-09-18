import { EvmChainId } from './evm-chain-id.enum'
import { NetworkNamespace } from './network-namespace.enum'
import { StardustNetworkName } from './stardust-network-name.enum'

export enum SupportedNetworkId {
    Shimmer = `${NetworkNamespace.Stardust}:${StardustNetworkName.Shimmer}`,
    Testnet = `${NetworkNamespace.Stardust}:${StardustNetworkName.Testnet}`,
    ShimmerEvm = `${NetworkNamespace.Evm}:${EvmChainId.ShimmerEvm}`,
    ShimmerEvmTestnet = `${NetworkNamespace.Evm}:${EvmChainId.ShimmerEvmTestnet}`,
}
