import { IBaseToken } from '@core/token/interfaces'
import { IProtocol } from './protocol.interface'
import { NetworkId } from '../types'

/**
 * Holds relevant data
 * necessary for interacting within the context
 * of a particular network.
 */
export interface IStardustNetworkMetadata {
    id: NetworkId
    name: string
    coinType: number
    protocol: IProtocol
    baseToken: IBaseToken
}
