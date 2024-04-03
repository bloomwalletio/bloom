import { handleError } from '@core/error/handlers'
import features from '@features/features'
import { Core } from '@walletconnect/core'
import { ICore } from '@walletconnect/types'
import { Web3Wallet } from '@walletconnect/web3wallet'
import { get } from 'svelte/store'
import { WALLET_METADATA } from '../constants'
import { onSessionDelete, onSessionProposal, onSessionRequest } from '../handlers'
import { chatClient, syncClient, walletClient } from '../stores'
import { setConnectedDapps } from '../stores/connected-dapps.store'
import { SyncClient, SyncStore } from '@walletconnect/sync-client'
import { ChatClient } from '@walletconnect/chat-client'

export async function initializeWalletConnect(): Promise<void> {
    const core = new Core({
        projectId: process.env.WALLETCONNECT_PROJECT_ID ?? '41511f9b50c46a80cdf8bd1a3532f2f9',
    })

    await initializeWalletClient(core)
    await initializeChatClient(core)
    await initializeSyncClient(core)
}

async function initializeWalletClient(core: ICore): Promise<void> {
    if (!features?.walletConnect?.enabled || get(walletClient)) {
        return
    }

    try {
        const client = await Web3Wallet.init({
            core,
            metadata: WALLET_METADATA,
        })
        walletClient.set(client)
        setConnectedDapps()

        client.on('session_proposal', (sessionProposal) => void onSessionProposal(sessionProposal))
        client.on('session_request', (event) => onSessionRequest(event))
        client.on('session_delete', (event) => onSessionDelete(event))
    } catch (err) {
        handleError(err)
    }
}

async function initializeSyncClient(core: ICore): Promise<void> {
    if (!features?.walletConnect?.chat?.enabled || get(syncClient)) {
        return
    }

    try {
        const client = await SyncClient.init({
            core,
            projectId: process.env.WALLETCONNECT_PROJECT_ID ?? '41511f9b50c46a80cdf8bd1a3532f2f9',
        })
        syncClient.set(client)
    } catch (err) {
        handleError(err)
    }
}

async function initializeChatClient(core: ICore): Promise<void> {
    const $syncClient = get(syncClient)
    if (!features?.walletConnect?.chat?.enabled || get(chatClient) || !$syncClient) {
        return
    }

    try {
        const client = await ChatClient.init({
            core,
            projectId: process.env.WALLETCONNECT_PROJECT_ID ?? '41511f9b50c46a80cdf8bd1a3532f2f9',
            keyserverUrl: 'https://keys.walletconnect.com',
            syncClient: $syncClient,
            SyncStoreController: SyncStore,
        })
        chatClient.set(client)
    } catch (err) {
        handleError(err)
    }
}
