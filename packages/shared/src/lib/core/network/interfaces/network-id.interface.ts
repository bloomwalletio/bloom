import { NetworkNamespace } from '../enums'
import { NetworkIdType, NetworkProtocolId } from '../types'

export interface INetworkId {
    id: NetworkIdType
    namespace: NetworkNamespace
    protocolId: NetworkProtocolId
}
