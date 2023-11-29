import type { ProposalTypes, RelayerTypes, SignClientTypes } from '@walletconnect/types'

export interface ISession {
    topic: string
    pairingTopic: string
    relay: RelayerTypes.ProtocolOptions
    expiry: number
    acknowledged: boolean
    controller: string
    namespaces: Record<
        string,
        {
            chains?: string[]
            accounts: string[]
            methods: string[]
            events: string[]
        }
    >
    requiredNamespaces: ProposalTypes.RequiredNamespaces
    optionalNamespaces: ProposalTypes.OptionalNamespaces
    sessionProperties?: ProposalTypes.SessionProperties
    self: {
        publicKey: string
        metadata: SignClientTypes.Metadata
    }
    peer: {
        publicKey: string
        metadata: SignClientTypes.Metadata
    }
}
