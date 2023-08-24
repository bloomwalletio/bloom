import { IDappMetadata } from './dapp-metadata.interface'
import { IPairing } from './pairing.interface'

export interface IConnectedDapp extends Omit<IPairing, 'peerMetadata'> {
    metadata?: IDappMetadata
}
