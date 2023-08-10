import { IBaseToken } from '@core/wallet'
import { INetworkId } from './network-id.interface'
import { IProtocol } from './protocol.interface'

/**
 * Holds relevant data
 * necessary for interacting within the context
 * of a particular network.
 */
export interface IStardustNetworkMetadata extends INetworkId {
    name: string
    coinType: number
    protocol: IProtocol
    baseToken: IBaseToken
}
