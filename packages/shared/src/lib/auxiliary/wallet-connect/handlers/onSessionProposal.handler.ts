import { Web3WalletTypes } from '@walletconnect/web3wallet'
import { sessionInitiationRequest } from '../stores'
import { get } from 'svelte/store'
import { rejectSessionInitiationRequest } from '../utils'

export function onSessionProposal(_sessionProposal: Web3WalletTypes.SessionProposal): void {
    if (get(sessionInitiationRequest)) {
        void rejectSessionInitiationRequest(_sessionProposal.id)
    } else {
        sessionInitiationRequest.set({ type: 'session_proposal', payload: _sessionProposal })
    }
}
