import { IBaseToken } from '@core/token'
import { NetworkNamespace } from '../enums'
import { NetworkId } from '../types'

export interface IBaseNetwork {
    id: NetworkId
    namespace: NetworkNamespace
    name: string
    baseToken: IBaseToken
    coinType: number
}
