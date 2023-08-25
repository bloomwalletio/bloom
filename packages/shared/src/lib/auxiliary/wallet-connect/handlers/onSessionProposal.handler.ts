import { Web3WalletTypes } from '@walletconnect/web3wallet'
import { sessionProposal } from '../stores'

export function onSessionProposal(_sessionProposal: Web3WalletTypes.SessionProposal): void {
    sessionProposal.set(_sessionProposal)
}
