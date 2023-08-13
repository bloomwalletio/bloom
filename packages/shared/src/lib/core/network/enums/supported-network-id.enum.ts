import { EvmChainId } from './evm-chain-id.enum'
import { NetworkNamespace } from './network-namespace.enum'
import { TangleNetworkId } from './tangle-network-id.enum'

export enum SupportedNetworkId {
    Iota = `${NetworkNamespace.Tangle}:${TangleNetworkId.Iota}`,
    Shimmer = `${NetworkNamespace.Tangle}:${TangleNetworkId.Shimmer}`,
    Testnet = `${NetworkNamespace.Tangle}:${TangleNetworkId.Testnet}`,
    ShimmerEvm = `${NetworkNamespace.Ethereum}:${EvmChainId.ShimmerEvm}`,
    ShimmerEvmTestnet = `${NetworkNamespace.Ethereum}:${EvmChainId.ShimmerEvmTestnet}`,
}
