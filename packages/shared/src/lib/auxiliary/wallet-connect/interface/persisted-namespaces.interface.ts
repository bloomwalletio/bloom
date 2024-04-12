import { ProposalTypes } from '@walletconnect/types'
import { SupportedNamespaces } from '../types'

export interface IPersistedNamespaces {
    supported: SupportedNamespaces
    required: ProposalTypes.RequiredNamespaces
    optional: ProposalTypes.OptionalNamespaces
}
