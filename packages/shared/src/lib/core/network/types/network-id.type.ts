import { NetworkNamespace, SupportedNetworkId } from '../enums'
import { NetworkProtocolId } from './network-protocol-id.type'

export type NetworkId = SupportedNetworkId | `${NetworkNamespace}:${NetworkProtocolId}`
