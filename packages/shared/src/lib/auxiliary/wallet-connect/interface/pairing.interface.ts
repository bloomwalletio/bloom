import { IDappMetadata } from './dapp-metadata.interface'

export interface IPairing {
    topic: string
    expiry: number
    relay: {
        protocol: string
        data?: string
    }
    active: boolean
    peerMetadata?: IDappMetadata
}
