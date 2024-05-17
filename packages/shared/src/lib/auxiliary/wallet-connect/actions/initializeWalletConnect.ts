import { handleError } from '@core/error/handlers'
import { Core } from '@walletconnect/core'
import { Web3Wallet } from '@walletconnect/web3wallet'
import { get } from 'svelte/store'
import { WALLET_METADATA } from '../constants'
import { onSessionDelete, onSessionProposal, onSessionRequest } from '../handlers'
import { walletClient } from '../stores/wallet-client.store'
import { setConnectedDapps } from '../stores/connected-dapps.store'
import { isFeatureEnabled } from '@lib/features/utils'

export async function initializeWalletConnect(): Promise<void> {
    if (isFeatureEnabled('walletConnect.web3Wallet')) {
        await initializeWalletClient()
    }
    if (isFeatureEnabled('walletConnect.notifications')) {
        // await initializeNotifyClient()
    }
}

async function initializeWalletClient(): Promise<void> {
    if (get(walletClient)) {
        return
    }

    try {
        const _walletClient = await Web3Wallet.init({
            core: new Core({
                projectId: process.env.WALLETCONNECT_PROJECT_ID,
            }),
            metadata: WALLET_METADATA,
        })
        walletClient.set(_walletClient)
        setConnectedDapps()

        _walletClient.on('session_proposal', (sessionProposal) => void onSessionProposal(sessionProposal))
        _walletClient.on('session_request', (event) => onSessionRequest(event))
        _walletClient.on('session_delete', (event) => onSessionDelete(event))
    } catch (err) {
        handleError(err)
    }
}
