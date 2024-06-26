import { ISupportedNamespace } from '../types'
import { IDappMetadata } from './dapp-metadata.interface'
import type { ProposalTypes } from '@walletconnect/types'

export interface IConnectedDapp {
    metadata: IDappMetadata

    // session
    sessionTopic?: string
    namespaces?: Record<string, ISupportedNamespace>
    requiredNamespaces?: ProposalTypes.RequiredNamespaces
    optionalNamespaces?: ProposalTypes.OptionalNamespaces

    // pairing
    pairingTopic?: string
}
