import { NetworkNamespace } from '../enums'
import { NetworkProtocolId } from '../types'

export interface INetworkId {
    id: string
    namespace: NetworkNamespace
    protocolId: NetworkProtocolId
}
