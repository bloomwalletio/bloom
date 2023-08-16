import { EvmChainId } from './evm-chain-id.enum'
import { NetworkNamespace } from './network-namespace.enum'
import { TangleNetworkName } from './tangle-network-name.enum'

export enum SupportedNetworkId {
    Iota = `${NetworkNamespace.Chrysalis}:${TangleNetworkName.Iota}`,
    Shimmer = `${NetworkNamespace.Stardust}:${TangleNetworkName.Shimmer}`,
    Testnet = `${NetworkNamespace.Stardust}:${TangleNetworkName.Testnet}`,
    ShimmerEvm = `${NetworkNamespace.Evm}:${EvmChainId.ShimmerEvm}`,
    ShimmerEvmTestnet = `${NetworkNamespace.Evm}:${EvmChainId.ShimmerEvmTestnet}`,
}
