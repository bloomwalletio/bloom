import { NetworkNamespace } from '../enums'
import { NetworkId } from '../types'

export interface IBaseNetwork {
    id: NetworkId
    namespace: NetworkNamespace
    name: string
    coinType: number
}
