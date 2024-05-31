import { Web3WalletTypes } from '@walletconnect/web3wallet'
import { connectionRequest } from '../stores'
import { get } from 'svelte/store'
import { rejectConnectionRequest } from '../utils'

export function onSessionAuthenticate(event: Web3WalletTypes.SessionAuthenticate): void {
    if (get(connectionRequest)) {
        void rejectConnectionRequest()
    } else {
        connectionRequest.set({ type: 'session_authenticate', payload: event })
    }
}
