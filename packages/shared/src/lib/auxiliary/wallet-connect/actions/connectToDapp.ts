import { IAccountState } from '@core/account'
import { persistDapp } from '../stores'
import { approveSession } from './approveSession'
import { clearOldPairings } from './clearOldPairings'
import { Web3WalletTypes } from '@walletconnect/web3wallet'
import { SupportedNamespaces } from '../types'
import { DappVerification } from '../enums'

export async function connectToDapp(
    supportedNamespaces: SupportedNamespaces,
    sessionProposal: Web3WalletTypes.SessionProposal,
    account: IAccountState
): Promise<void> {
    const dappUrl = sessionProposal.params.proposer.metadata.url
    const { requiredNamespaces, optionalNamespaces } = sessionProposal.params

    await clearOldPairings(dappUrl)
    await approveSession(sessionProposal, supportedNamespaces, account)

    const verificationState = sessionProposal.verifyContext.verified
    persistDapp(
        dappUrl,
        verificationState.isScam ? DappVerification.Scam : (verificationState.validation as DappVerification),
        { supported: supportedNamespaces, required: requiredNamespaces, optional: optionalNamespaces }
    )
}
