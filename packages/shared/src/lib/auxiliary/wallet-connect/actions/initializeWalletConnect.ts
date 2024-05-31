import { handleError } from '@core/error/handlers'
import features from '@features/features'
import { Core } from '@walletconnect/core'
import { Web3Wallet } from '@walletconnect/web3wallet'
import { get } from 'svelte/store'
import { WALLET_METADATA } from '../constants'
import { onSessionDelete, onSessionProposal, onSessionRequest } from '../handlers'
import { walletClient } from '../stores'
import { setConnectedDapps } from '../stores/connected-dapps.store'
import { onSessionAuthenticate } from '../handlers/onSessionAuthenticate.handler'

export async function initializeWalletConnect(): Promise<void> {
    if (!features?.walletConnect?.enabled || get(walletClient)) {
        return
    }

    try {
        const client = await Web3Wallet.init({
            core: new Core({
                projectId: process.env.WALLETCONNECT_PROJECT_ID ?? '41511f9b50c46a80cdf8bd1a3532f2f9',
            }),
            metadata: WALLET_METADATA,
        })
        walletClient.set(client)
        setConnectedDapps()

        client.on('session_proposal', (sessionProposal) => void onSessionProposal(sessionProposal))
        client.on('session_request', (event) => onSessionRequest(event))
        client.on('session_delete', (event) => onSessionDelete(event))
        client.on('session_authenticate', (payload) => onSessionAuthenticate(payload))
    } catch (err) {
        handleError(err)
    }
}
