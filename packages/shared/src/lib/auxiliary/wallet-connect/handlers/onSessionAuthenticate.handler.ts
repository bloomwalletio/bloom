import { Web3WalletTypes } from '@walletconnect/web3wallet'
import { get } from 'svelte/store'
import { sessionInitiationRequest } from '../stores'
import { rejectSessionInitiationRequest } from '../utils'
import { SessionInitiationType } from '../enums'

export function onSessionAuthenticate(event: Web3WalletTypes.SessionAuthenticate): void {
    if (get(sessionInitiationRequest)) {
        void rejectSessionInitiationRequest(event.id, SessionInitiationType.SessionAuthenticate)
    } else {
        sessionInitiationRequest.set({ type: SessionInitiationType.SessionAuthenticate, payload: event })
    }
}
