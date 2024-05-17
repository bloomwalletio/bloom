import { buildAccountForWalletConnect } from '@auxiliary/wallet-connect/utils'
import { IAccountState } from '@core/account'
import { EvmNetworkId, IEvmNetwork } from '@core/network'
import { signMessage } from '@core/wallet'
import { NotifyClient, NotifyClientTypes } from '@walletconnect/notify-client'
import { Writable, writable } from 'svelte/store'
import { NotifyEvent } from '../enums'
import {
    notifySubscriptionEventHandler,
    notifyMessageEventHandler,
    notifyUpdateEventHandler,
    notifySubscriptionsChangedEventHandler,
} from '../handlers'

// TODO: where should this be placed?
const APP_DOMAIN = 'https://bloomwallet.io'

export class NotificationsManager {
    private initiliased: boolean = false
    private notifyClient: NotifyClient | undefined
    private trackedNetworkAddresses: string[] = []
    public notifications: Writable<Record<string, NotifyClientTypes.NotifyNotification[]>> = writable({})
    public subscriptions: Writable<Record<string, NotifyClientTypes.NotifySubscription[]>> = writable({})

    constructor() {
        void this.initialiseNotify()
    }

    async initialiseNotify(): Promise<void> {
        try {
            this.notifyClient = await NotifyClient.init({
                projectId: process.env.WALLETCONNECT_PROJECT_ID,
            })
            this.initialiseHandlers()
            this.initiliased = true
        } catch {
            console.error('Unable to initialise Notify Client')
        }
    }

    updateTrackedNetworkAccounts(accounts: IAccountState[], networkId: EvmNetworkId): void {
        this.trackedNetworkAddresses = accounts
            .map((acc) => buildAccountForWalletConnect(acc, networkId))
            .filter(Boolean) as string[]
        this.notifications = writable({})
        this.subscriptions = writable({})
    }

    initialiseHandlers(): void {
        if (!this.notifyClient) {
            return
        }

        this.notifyClient.on(NotifyEvent.Subscription, notifySubscriptionEventHandler)

        this.notifyClient.on(NotifyEvent.Message, notifyMessageEventHandler)

        this.notifyClient.on(NotifyEvent.Update, notifyUpdateEventHandler)

        this.notifyClient.on(NotifyEvent.SubscriptionsChanged, notifySubscriptionsChangedEventHandler)
    }

    static buildNotifyClientOptions(
        account: IAccountState,
        networkId: EvmNetworkId
    ):
        | {
              account: string
              domain: string
              allApps: boolean
          }
        | undefined {
        const networkAddress = buildAccountForWalletConnect(account, networkId)
        if (!networkAddress) {
            return undefined
        }

        return {
            account: networkAddress,
            domain: APP_DOMAIN,
            allApps: true,
        }
    }

    isRegistered(account: IAccountState, network: IEvmNetwork): boolean {
        const notifyClientOptions = NotificationsManager.buildNotifyClientOptions(account, network.id)
        if (!notifyClientOptions) {
            return false
        }

        return this.notifyClient?.isRegistered(notifyClientOptions) || false
    }

    async registerAccount(account: IAccountState, network: IEvmNetwork): Promise<void> {
        if (!this.notifyClient) {
            return
        }

        const notifyClientOptions = NotificationsManager.buildNotifyClientOptions(account, network.id)
        if (!notifyClientOptions) {
            return
        }

        const { registerParams, message } = await this.notifyClient.prepareRegistration(notifyClientOptions)
        const signature = await signMessage(message, network.coinType, account)
        if (!signature) {
            return
        }

        await this.notifyClient.register({
            registerParams,
            signature,
        })
    }

    async subscribeToDapp(
        appDomain: string,
        account: IAccountState | undefined,
        networkId: EvmNetworkId
    ): Promise<void> {
        if (!this.notifyClient || !account) {
            return
        }

        const networkAddress = buildAccountForWalletConnect(account, networkId)
        if (!networkAddress) return

        await this.notifyClient?.subscribe({ appDomain, account: networkAddress })

        console.error('Subscribed to notifications')
        const subscriptions = this.notifyClient.getActiveSubscriptions({ account: networkAddress })
        console.error('Subscriptions:', subscriptions)

        const firstSubscription = Object.values(subscriptions ?? {})[0]
        console.error('First subscription:', firstSubscription, firstSubscription.topic)

        const notifications = await notificationsManager.notifyClient?.getNotificationHistory({
            topic: firstSubscription.topic,
        })

        console.error('Notifications:', notifications)
    }
}

export const notificationsManager = new NotificationsManager()
