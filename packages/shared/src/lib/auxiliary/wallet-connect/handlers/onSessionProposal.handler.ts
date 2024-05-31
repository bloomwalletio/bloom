import { Web3WalletTypes } from '@walletconnect/web3wallet'
import { sessionInitiationRequest } from '../stores'
import { get } from 'svelte/store'
import { rejectConnectionRequest } from '../utils'

export function onSessionProposal(_sessionProposal: Web3WalletTypes.SessionProposal): void {
    if (get(sessionInitiationRequest)) {
        void rejectConnectionRequest()
    } else {
        sessionInitiationRequest.set({ type: 'session_proposal', payload: _sessionProposal })
    }
}
