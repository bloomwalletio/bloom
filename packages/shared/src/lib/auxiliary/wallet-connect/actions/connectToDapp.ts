import { IAccountState } from '@core/account'
import { persistDappNamespacesForDapp } from '../stores'
import { approveSession } from './approveSession'
import { buildSupportedNamespacesFromSelections } from './buildSupportedNamespaceFromSelections'
import { clearOldPairings } from './clearOldPairings'
import { ISelections } from '../interface'
import { Web3WalletTypes } from '@walletconnect/web3wallet'
import { SupportedNamespaces } from '../types'

export async function connectToDapp(
    selections: ISelections,
    persistedSupportedNamespaces: SupportedNamespaces | undefined,
    sessionProposal: Web3WalletTypes.SessionProposal,
    account: IAccountState
): Promise<void> {
    const dappUrl = sessionProposal.params.proposer.metadata.url
    const { requiredNamespaces, optionalNamespaces } = sessionProposal.params

    const supportedNamespaces = buildSupportedNamespacesFromSelections(
        selections,
        requiredNamespaces,
        optionalNamespaces,
        persistedSupportedNamespaces
    )

    await clearOldPairings(dappUrl)
    await approveSession(sessionProposal, supportedNamespaces, account)
    persistDappNamespacesForDapp(dappUrl, supportedNamespaces, requiredNamespaces, optionalNamespaces)
}
