import { NetworkId } from '@core/network/types'
import { SubjectType } from '../enums'

export interface INetworkSubject {
    type: SubjectType.Network
    name: string
    id: NetworkId
    address: string
}
