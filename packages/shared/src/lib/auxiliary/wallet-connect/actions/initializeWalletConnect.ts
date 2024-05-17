import { handleError } from '@core/error/handlers'
import features from '@features/features'
import { Core } from '@walletconnect/core'
import { Web3Wallet } from '@walletconnect/web3wallet'
import { NotifyClient } from '@walletconnect/notify-client'
import { get } from 'svelte/store'
import { WALLET_METADATA } from '../constants'
import { onSessionDelete, onSessionProposal, onSessionRequest } from '../handlers'
import { walletClient } from '../stores'
import { setConnectedDapps } from '../stores/connected-dapps.store'

export async function initializeWalletConnect(): Promise<void> {
    if (!features?.walletConnect?.enabled) {
        return
    }

    await initializeWalletClient()
    await initializeNotifyClient()
}

async function initializeWalletClient(): Promise<void> {
    if (!features?.walletConnect?.enabled || get(walletClient)) {
        return
    }

    try {
        const _walletClient = await Web3Wallet.init({
            core: new Core({
                projectId: process.env.WALLETCONNECT_PROJECT_ID ?? '41511f9b50c46a80cdf8bd1a3532f2f9',
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

async function initializeNotifyClient(): Promise<void> {
    const notifyClient = await NotifyClient.init({
        projectId: process.env.WALLETCONNECT_PROJECT_ID ?? '41511f9b50c46a80cdf8bd1a3532f2f9',
    })

    notifyClient.on('notify_subscription', ({ params }) => {
        const { error } = params

        if (error) {
            console.error('Setting up subscription failed: ', error)
        } else {
            console.warn('Subscribed successfully.')
        }
    })

    notifyClient.on('notify_message', ({ params }) => {
        const { message } = params
        console.warn('Message: ', message)
    })

    notifyClient.on('notify_update', ({ params }) => {
        const { error } = params

        if (error) {
            console.error('Setting up subscription failed: ', error)
        } else {
            console.warn('Successfully updated subscription scope.')
        }
    })

    notifyClient.on('notify_subscriptions_changed', ({ params }) => {
        const { subscriptions } = params
        console.warn('Changed subscriptions: ', subscriptions)
        // `subscriptions` will contain any *changed* subscriptions since the last time this event was emitted.
        // To get a full list of subscriptions for a given account you can use `notifyClient.getActiveSubscriptions({ account: 'eip155:1:0x63Be...' })`
    })
}
