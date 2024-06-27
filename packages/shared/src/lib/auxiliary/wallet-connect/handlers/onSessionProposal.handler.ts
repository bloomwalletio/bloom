import { Web3WalletTypes } from '@walletconnect/web3wallet'
import { sessionInitiationRequest } from '../stores'
import { get } from 'svelte/store'
import { rejectSessionInitiationRequest } from '../utils'
import { SessionInitiationType } from '../enums'

export function onSessionProposal(_sessionProposal: Web3WalletTypes.SessionProposal): void {
    if (get(sessionInitiationRequest)) {
        void rejectSessionInitiationRequest(_sessionProposal.id, SessionInitiationType.SessionProposal)
    } else {
        sessionInitiationRequest.set({ type: SessionInitiationType.SessionProposal, payload: _sessionProposal })
    }
}
