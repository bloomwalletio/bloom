import { buildNetworkAddressForWalletConnect } from '../../utils'
import { IAccountState } from '@core/account'
import { EvmNetworkId, IEvmNetwork } from '@core/network'
import { signMessage } from '@core/wallet'
import { NotifyClient, NotifyClientTypes } from '@walletconnect/notify-client'
import { Writable, get, writable } from 'svelte/store'
import { NotifyEvent } from '../enums'
import { WALLET_CONNECT_CORE } from '../../constants/wallet-connect-core.constant'

// TODO: where should this be placed?
const APP_DOMAIN = 'https://bloomwallet.io'

export type Notifications = { [topic: string]: NotifyClientTypes.NotifyNotification[] }
export type Subscriptions = { [topic: string]: NotifyClientTypes.NotifySubscription }
export class NotificationsManager {
    private notifyClient: NotifyClient | undefined
    private trackedNetworkAddresses: Set<string> = new Set()
    public subscriptionsPerAddress: Writable<{ [address: string]: Subscriptions }> = writable({})
    public notificationsPerSubscription: Writable<Notifications> = writable({})

    constructor() {}

    async init(): Promise<void> {
        try {
            this.notifyClient = await NotifyClient.init({
                core: WALLET_CONNECT_CORE,
            })
            this.initialiseHandlers()
        } catch (err) {
            console.error('Unable to initialise Notify Client', err)
        }
    }

    private initialiseHandlers(): void {
        if (!this.notifyClient) {
            return
        }

        this.notifyClient.on(
            NotifyEvent.SubscriptionsChanged,
            (event: NotifyClientTypes.EventArguments[NotifyEvent.SubscriptionsChanged]) => {
                this.updateSubscriptionsPerAddress(event.params.subscriptions)
                void this.updateNotificationsForSubscriptions(event.params.subscriptions)
            }
        )

        // There is both a notification and a message event that returns at the same time,
        // We have only registered a listener for notification and will ask WC what the difference is
        this.notifyClient.on(
            NotifyEvent.Notification,
            (event: NotifyClientTypes.EventArguments[NotifyEvent.Notification]) => {
                // The types are not correct on this event, so we need to cast it to the correct type
                this.handleNewNotification(
                    event.topic,
                    event.params.notification as unknown as NotifyClientTypes.NotifyServerNotification
                )
            }
        )

        this.notifyClient.on(NotifyEvent.Update, (event: NotifyClientTypes.EventArguments[NotifyEvent.Update]) => {
            console.warn('Unimplemented: NotifyEvent.Update', event)
        })

        this.notifyClient.on(NotifyEvent.Delete, (event: NotifyClientTypes.EventArguments[NotifyEvent.Delete]) => {
            console.warn('Unimplemented: NotifyEvent.Delete', event)
        })

        this.notifyClient.on(
            NotifyEvent.Subscription,
            (event: NotifyClientTypes.EventArguments[NotifyEvent.Subscription]) => {
                console.warn('Unimplemented: NotifyEvent.Subscription', event)
            }
        )
    }

    private static buildNotifyClientOptions(
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
        await this.addTrackedNetworkAccounts([account], network.id)
    }

    async setTrackedNetworkAccounts(accounts: IAccountState[], networkId: EvmNetworkId): Promise<void> {
        this.trackedNetworkAddresses.clear()
        this.notificationsPerSubscription.set({})
        this.subscriptionsPerAddress.set({})

        await this.addTrackedNetworkAccounts(accounts, networkId)
    }

    getSubscriptionsForTopic(topic: string): NotifyClientTypes.NotifySubscription | undefined {
        return Object.values(get(this.subscriptionsPerAddress))
            .map((subscriptions) => subscriptions[topic])
            .find(Boolean)
    }

    async addTrackedNetworkAccounts(accounts: IAccountState[], networkId: EvmNetworkId): Promise<void> {
        const newNetworkAddressesToTrack = new Set(
            accounts
                .map((acc) => buildNetworkAddressForWalletConnect(acc, networkId))
                .filter(
                    (acc) =>
                        acc &&
                        this.notifyClient?.watchedAccounts.getAll().some((accountObj) => accountObj.account === acc)
                )
                .filter(Boolean)
        )

        // TODO: Upgrade to this set operation once we upgade node to v22+
        newNetworkAddressesToTrack.forEach((address) => this.trackedNetworkAddresses.add(address))
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/union#browser_compatibility
        // this.trackedNetworkAddresses = this.trackedNetworkAddresses.union(newNetworkAddressesToTrack)

        for (const networkAddress of newNetworkAddressesToTrack) {
            await this.updateSubscriptionsAndNotificationsForNetworkAddress(networkAddress)
        }
    }

    clearTrackedNetworkAccounts(): void {
        this.trackedNetworkAddresses.clear()
        this.subscriptionsPerAddress.set({})
        this.notificationsPerSubscription.set({})
    }

    private async updateSubscriptionsAndNotificationsForNetworkAddress(networkAddress: string): Promise<void> {
        if (!this.notifyClient) {
            return
        }

        const activeSubscriptions = Object.values(this.notifyClient.getActiveSubscriptions({ account: networkAddress }))

        this.updateSubscriptionsPerAddress(activeSubscriptions)

        await this.updateNotificationsForSubscriptions(activeSubscriptions)
    }

    private updateSubscriptionsPerAddress(newSubscriptions: NotifyClientTypes.NotifySubscription[]): void {
        this.subscriptionsPerAddress.update((state) => {
            for (const subscription of newSubscriptions) {
                const subscriptionsForAccount = state[subscription.account] ?? {}
                subscriptionsForAccount[subscription.topic] = subscription
                state[subscription.account] = subscriptionsForAccount
            }

            return state
        })
    }

    private async updateNotificationsForSubscriptions(
        subscriptions: NotifyClientTypes.NotifySubscription[]
    ): Promise<void> {
        if (!this.notifyClient) {
            return
        }

        const notificationsPerSubscription: Notifications = {}
        for (const subscription of subscriptions) {
            const notificationHistory = await this.notifyClient.getNotificationHistory({ topic: subscription.topic })
            notificationsPerSubscription[subscription.topic] = notificationHistory.notifications
        }

        this.notificationsPerSubscription.update((state) => {
            return { ...state, ...notificationsPerSubscription }
        })
    }

    private handleNewNotification(topic: string, notification: NotifyClientTypes.NotifyServerNotification): void {
        const notificationsForTopic = get(this.notificationsPerSubscription)[topic]

        if (!notificationsForTopic || notificationsForTopic?.find((n) => n.id === notification.id)) {
            return
        }

        this.notificationsPerSubscription.update((state) => {
            const parsedNotification = {
                title: notification.title,
                sentAt: notification.sent_at,
                body: notification.body,
                id: notification.id,
                url: notification.url,
                isRead: notification.is_read,
                type: notification.type,
            }

            state[topic] = [...state[topic], parsedNotification]
            return state
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

        const networkAddress = buildNetworkAddressForWalletConnect(account, networkId)
        if (!networkAddress) {
            return
        }

        await this.notifyClient?.subscribe({ appDomain, account: networkAddress })
    }

    markAsRead(notificationIds: string[], topic: string): void {
        this.notifyClient?.markNotificationsAsRead({ notificationIds, topic })
        this.notificationsPerSubscription.update((state) => {
            state[topic] = state[topic].map((notification) => {
                if (notificationIds.includes(notification.id)) {
                    notification.isRead = true
                }
                return notification
            })
            return state
        })
    }
}

export const notificationsManager = new NotificationsManager()
