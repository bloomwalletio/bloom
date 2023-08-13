import { NetworkNamespace, SupportedNetworkId } from '../enums'
import { NetworkProtocolId } from './network-protocol-id.type'

export type NetworkIdType = SupportedNetworkId | `${NetworkNamespace}:${NetworkProtocolId}`
