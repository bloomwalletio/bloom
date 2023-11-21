import features from '@features/features'
import { WALLET_METADATA } from '../constants'
import { onSessionDelete, onSessionProposal, onSessionRequest } from '../handlers'
import { walletClient } from '../stores'
import { Web3Wallet } from '@walletconnect/web3wallet'
import { Core } from '@walletconnect/core'
import { setConnectedDapps } from '../stores/connected-dapps.store'
import { get } from 'svelte/store'
import { updateActiveSessionsToActiveProfile } from '../utils'

const core = new Core({
    projectId: process.env.WALLETCONNECT_PROJECT_ID ?? '41511f9b50c46a80cdf8bd1a3532f2f9',
})

export async function initializeWalletConnect(): Promise<void> {
    if (!features?.walletConnect?.enabled) {
        return
    }

    if (!get(walletClient)) {
        const client = await Web3Wallet.init({
            core,
            metadata: WALLET_METADATA,
        })
        walletClient.set(client)
        setConnectedDapps()

        client.on('session_proposal', (sessionProposal) => void onSessionProposal(sessionProposal))
        client.on('session_request', (event) => onSessionRequest(event))
        client.on('session_delete', (event) => onSessionDelete(event))
    } else {
        try {
            await updateActiveSessionsToActiveProfile()
        } catch (error) {
            console.error(error)
        }
    }
}
