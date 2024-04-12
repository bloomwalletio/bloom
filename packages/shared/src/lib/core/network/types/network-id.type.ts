import { ChainId, NetworkNamespace, StardustNetworkName } from '../enums'

export type StardustNetworkId = `${NetworkNamespace.Stardust}:${StardustNetworkName | string}`
export type EvmNetworkId = `${NetworkNamespace.Evm}:${ChainId | string}`

export type NetworkId = StardustNetworkId | EvmNetworkId
