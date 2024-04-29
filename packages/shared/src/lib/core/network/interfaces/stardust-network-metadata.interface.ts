import { IProtocol } from './protocol.interface'
import { StardustNetworkId } from '../types'
import { NetworkNamespace } from '../enums'
import { IBaseNetworkMetadata, IIscChainConfiguration } from '../interfaces'

/**
 * Holds relevant data
 * necessary for interacting within the context
 * of a particular network.
 */
export interface IStardustNetworkMetadata extends IBaseNetworkMetadata {
    id: StardustNetworkId
    namespace: NetworkNamespace.Stardust
    protocol: IProtocol
    chainConfigurations: IIscChainConfiguration[]
}
