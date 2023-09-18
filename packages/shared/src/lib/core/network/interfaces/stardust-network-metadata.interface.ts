import { IBaseToken } from '@core/token/interfaces'
import { NetworkNamespace, StardustNetworkName } from '../enums'
import { NetworkId } from '../types'
import { IProtocol } from './protocol.interface'

/**
 * Holds relevant data
 * necessary for interacting within the context
 * of a particular network.
 */
export interface IStardustNetworkMetadata {
    id: NetworkId
    name: string
    namespace: NetworkNamespace.Stardust
    networkName: StardustNetworkName | string
    coinType: number
    protocol: IProtocol
    baseToken: IBaseToken
}
