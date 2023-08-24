import { EvmChainId, NetworkNamespace, StardustNetworkName } from '../enums'

export type NetworkId =
    | `${NetworkNamespace.Stardust}:${StardustNetworkName | string}`
    | `${NetworkNamespace.Evm}:${EvmChainId}`
