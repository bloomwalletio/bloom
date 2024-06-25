import { Web3WalletTypes } from '@walletconnect/web3wallet'
import { get } from 'svelte/store'
import { sessionInitiationRequest } from '../stores'
import { rejectSessionInitiationRequest } from '../utils'

export function onSessionAuthenticate(event: Web3WalletTypes.SessionAuthenticate): void {
    if (get(sessionInitiationRequest)) {
        void rejectSessionInitiationRequest(event.id, 'session_authenticate')
    } else {
        sessionInitiationRequest.set({ type: 'session_authenticate', payload: event })
    }
}
