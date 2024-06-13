import { handleError } from '@core/error/handlers'
import { Web3Wallet } from '@walletconnect/web3wallet'
import { get } from 'svelte/store'
import { Core } from '@walletconnect/core'
import { WALLET_METADATA } from '../constants'
import { onSessionDelete, onSessionProposal, onSessionRequest } from '../handlers'
import { walletClient } from '../stores/wallet-client.store'
import { setConnectedDapps } from '../stores/connected-dapps.store'
import { isFeatureEnabled } from '@lib/features/utils'
import { notificationsManager } from '../notifications'
import { ICore } from '@walletconnect/types'

export async function initializeWalletConnect(): Promise<void> {
    const core = new Core({
        projectId: process.env.WALLETCONNECT_PROJECT_ID ?? '41511f9b50c46a80cdf8bd1a3532f2f9',
    })
    if (isFeatureEnabled('walletConnect.web3Wallet')) {
        await initializeWalletClient(core)
    }
    if (isFeatureEnabled('walletConnect.notifications')) {
        await notificationsManager.init(core)
    }
}

async function initializeWalletClient(core: ICore): Promise<void> {
    if (get(walletClient)) {
        return
    }

    try {
        const _walletClient = await Web3Wallet.init({
            core,
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
