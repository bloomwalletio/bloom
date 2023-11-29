import { IDappMetadata } from './dapp-metadata.interface'
import { IPairing } from './pairing.interface'
import { ISession } from './session.interface'

export interface IConnectedDapp extends Omit<IPairing, 'peerMetadata'> {
    metadata?: IDappMetadata
    session?: ISession
}
