import { buildNetworkAddressForWalletConnect } from '@auxiliary/wallet-connect/utils'
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

export type Notifications = { [subscriptionTopic: string]: NotifyClientTypes.NotifyNotification[] }
export class NotificationsManager {
    private initiliased: boolean = false
    private notifyClient: NotifyClient | undefined
    private trackedNetworkAddresses: Set<string> = new Set()
    public subscriptions: Writable<{ [address: string]: NotifyClientTypes.NotifySubscription[] }> = writable({})
    public notificationsPerSubscription: Writable<Notifications> = writable({})
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

    async setTrackedNetworkAccounts(accounts: IAccountState[], networkId: EvmNetworkId): Promise<void> {
        this.trackedNetworkAddresses.clear()
        this.notificationsPerSubscription.set({})
        this.subscriptions.set({})

        await this.updateTrackedNetworkAccounts(accounts, networkId)
    }

    async updateTrackedNetworkAccounts(accounts: IAccountState[], networkId: EvmNetworkId): Promise<void> {
        const newNetworkAddressesToTrack = new Set(
            accounts
                .map((acc) => buildNetworkAddressForWalletConnect(acc, networkId))
                .filter(
                    (acc) =>
                        acc &&
                        this.notifyClient?.watchedAccounts.getAll().some((accountObj) => accountObj.account === acc)
                )
                .filter(Boolean) as string[]
        )

        // TODO: Upgrade to this set operation once we upgade node to v22+
        newNetworkAddressesToTrack.forEach((address) => this.trackedNetworkAddresses.add(address))
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/union#browser_compatibility
        // this.trackedNetworkAddresses = this.trackedNetworkAddresses.union(newNetworkAddressesToTrack)

        for (const address of this.trackedNetworkAddresses) {
            await this.setAllNotificationsAndSubscriptionsForNetworkAddress(address)
        }
    }

    clearTrackedNetworkAccounts(): void {
        this.trackedNetworkAddresses.clear()
        this.notificationsPerSubscription.set({})
        this.subscriptions.set({})
    }

    initialiseHandlers(): void {
        if (!this.notifyClient) {
            return
        }

        this.notifyClient.on(NotifyEvent.Subscription, notifySubscriptionEventHandler)

        this.notifyClient.on(NotifyEvent.Message, notifyMessageEventHandler)

        this.notifyClient.on(NotifyEvent.Update, notifyUpdateEventHandler)
        this.notifyClient.on(NotifyEvent.SubscriptionsChanged, (event) => {
            for (const address of this.trackedNetworkAddresses) {
                void this.setAllNotificationsAndSubscriptionsForNetworkAddress(address)
            }

            notifySubscriptionsChangedEventHandler(event)
        })
    }

    async setAllNotificationsAndSubscriptionsForNetworkAddress(address: string): Promise<void> {
        if (!this.notifyClient) {
            return
        }

        const subscriptions = this.notifyClient.getActiveSubscriptions({ account: address })

        const allNotifications: Notifications = {}
        for (const subscription of Object.values(subscriptions)) {
            const notifications = await this.notifyClient.getNotificationHistory({ topic: subscription.topic })
            allNotifications[subscription.topic] = notifications.notifications
        }

        this.subscriptions.update((state) => {
            state[address] = Object.values(subscriptions)
            return state
        })
        this.notificationsPerSubscription.update((state) => {
            return { ...state, ...allNotifications }
        })
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
        const networkAddress = buildNetworkAddressForWalletConnect(account, networkId)
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

        const address = buildNetworkAddressForWalletConnect(account, network.id)
        if (!address) {
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
        await this.updateTrackedNetworkAccounts([account], network.id)
    }

    async subscribeToDapp(
        appDomain: string,
        account: IAccountState | undefined,
        networkId: EvmNetworkId
    ): Promise<void> {
        if (!this.notifyClient || !account) {
            return
        }

        const networkAddress = buildNetworkAddressForWalletConnect(account, networkId)
        if (!networkAddress) {
            return
        }

        await this.notifyClient?.subscribe({ appDomain, account: networkAddress })

        await this.setAllNotificationsAndSubscriptionsForNetworkAddress(networkAddress)
    }
}

export const notificationsManager = new NotificationsManager()
