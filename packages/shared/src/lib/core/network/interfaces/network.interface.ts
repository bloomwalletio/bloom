import { NetworkNamespace } from '../enums'
import { NetworkId } from '../types'

export interface INetwork {
    id: NetworkId
    namespace: NetworkNamespace
    name: string
    coinType: number
}
