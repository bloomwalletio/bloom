export interface Pairing {
    topic: string
    expiry: number
    relay: {
        protocol: string
        data?: string
    }
    active: boolean
    peerMetadata?: {
        name: string
        description: string
        url: string
        icons: string[]
        verifyUrl?: string
        redirect?: {
            native?: string
            universal?: string
        }
    }
}
