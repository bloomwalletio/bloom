import { EvmChainId, TangleNetworkName } from '../enums'

/**
 * NOTE: The `string` type is for covering IDs of private or
 * custom networks or chains.
 */
export type NetworkProtocolId = TangleNetworkName | EvmChainId | string
