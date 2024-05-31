import { getSdkError } from '@walletconnect/utils'
import { Web3WalletTypes } from '@walletconnect/web3wallet'
import { get } from 'svelte/store'
import { getWalletClient, sessionInitiationRequest } from '../stores'

export function onSessionAuthenticate(event: Web3WalletTypes.SessionAuthenticate): void {
    if (get(sessionInitiationRequest)) {
        // TODO: should we reject the existing one and set the new one, while resetting the flow for the user?
        void getWalletClient()?.rejectSessionAuthenticate({
            id: event.id,
            reason: getSdkError('USER_REJECTED'),
        })
    } else {
        sessionInitiationRequest.set({ type: 'session_authenticate', payload: event })
    }
}
