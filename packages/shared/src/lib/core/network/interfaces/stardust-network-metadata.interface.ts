import { IBaseToken } from '@core/wallet/interfaces'
import { IProtocol } from './protocol.interface'
import { NetworkIdType } from '../types'

/**
 * Holds relevant data
 * necessary for interacting within the context
 * of a particular network.
 */
export interface IStardustNetworkMetadata {
    id: NetworkIdType
    name: string
    coinType: number
    protocol: IProtocol
    baseToken: IBaseToken
}
