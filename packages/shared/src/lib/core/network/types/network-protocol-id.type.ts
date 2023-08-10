import { EvmChainId, TangleNetworkId } from '../enums'

/**
 * NOTE: The `string` type is for covering IDs of private or
 * custom networks or chains.
 */
export type NetworkProtocolId = TangleNetworkId | EvmChainId | string
