import { getCaip10AddressForAccount } from '../../utils'
import { IAccountState } from '@core/account'
import { EvmNetworkId, SupportedIscNetworkId } from '@core/network'
import { signMessage } from '@core/wallet'
import { NotifyClient, NotifyClientTypes } from '@walletconnect/notify-client'
import { Writable, get, writable } from 'svelte/store'
import { NotifyEvent } from '../enums'
import { WALLET_CONNECT_CORE } from '../../constants/wallet-connect-core.constant'
import { PartialWithId } from '@core/utils'

// TODO: where should this be placed?
const APP_DOMAIN = 'bloomwallet.io'
const APP_URL = 'https://' + APP_DOMAIN

export type Notifications = { [topic: string]: NotifyClientTypes.NotifyNotification[] }
export type Subscriptions = { [topic: string]: NotifyClientTypes.NotifySubscription }
export class NotificationsManager {
    private notifyClient: NotifyClient | undefined
    public trackedNetworkAddresses: Writable<Set<string>> = writable(new Set())
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
                const subscriptions = event.params.subscriptions.filter((subscription) =>
                    get(this.trackedNetworkAddresses).has(subscription.account)
                )

                this.updateSubscriptionsPerAddress(subscriptions)
                void this.updateNotificationsForSubscriptions(subscriptions)
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
            (_event: NotifyClientTypes.EventArguments[NotifyEvent.Subscription]) => {
                // Unable to do this as expected because the subscription we receive back here is the wrong one...
                /* const newSubscription = event.params.subscription
                if (newSubscription && get(this.trackedNetworkAddresses)?.has(newSubscription?.account)) {
                    this.updateSubscriptionsPerAddress([newSubscription])
                    void this.updateNotificationsForSubscriptions([newSubscription])
                } */
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
        const caip10Address = getCaip10AddressForAccount(account, networkId)
        if (!caip10Address) {
            return undefined
        }

        return {
            account: caip10Address,
            domain: APP_URL,
            allApps: true,
        }
    }

    isRegistered(account: IAccountState, networkId: EvmNetworkId): boolean {
        const notifyClientOptions = NotificationsManager.buildNotifyClientOptions(account, networkId)
        if (!notifyClientOptions) {
            return false
        }

        return this.notifyClient?.isRegistered(notifyClientOptions) || false
    }

    async registerAccount(account: IAccountState, networkId: EvmNetworkId, coinType: number): Promise<void> {
        if (!this.notifyClient) {
            return
        }

        const notifyClientOptions = NotificationsManager.buildNotifyClientOptions(account, networkId)
        if (!notifyClientOptions) {
            return
        }

        if (this.notifyClient.isRegistered(notifyClientOptions)) {
            return
        }

        const { registerParams, message } = await this.notifyClient.prepareRegistration(notifyClientOptions)
        const signature = await signMessage(message, coinType, account)
        if (!signature) {
            return
        }

        await this.notifyClient.register({
            registerParams,
            signature,
        })

        this.addTrackedNetworkAccounts([account], networkId)

        if (Object.values(SupportedIscNetworkId).includes(networkId)) {
            await this.subscribeToBloom(account, networkId)
        }
    }

    async unregisterAccount(account: IAccountState, networkId: EvmNetworkId): Promise<void> {
        if (!this.notifyClient) {
            return
        }

        const caip10Address = getCaip10AddressForAccount(account, networkId)
        if (!caip10Address) {
            return
        }

        await this.notifyClient.unregister({ account: caip10Address })
        this.removeTrackedNetworkAccounts(caip10Address)
    }

    async setTrackedNetworkAccounts(accounts: IAccountState[], networkIds: EvmNetworkId[]): Promise<void> {
        this.trackedNetworkAddresses.set(new Set())
        for (const networkId of networkIds) {
            this.addTrackedNetworkAccounts(accounts, networkId)
        }
        await this.refreshAllSubscriptionsAndNotificationsForTrackedAccounts()
    }

    getSubscriptionsForTopic(topic: string): NotifyClientTypes.NotifySubscription | undefined {
        return Object.values(get(this.subscriptionsPerAddress))
            .map((subscriptions) => subscriptions[topic])
            .find(Boolean)
    }

    addTrackedNetworkAccounts(accounts: IAccountState[], networkId: EvmNetworkId): void {
        const newNetworkAddressesToTrack = new Set(
            accounts
                .filter((account) => this.isRegistered(account, networkId))
                .map((acc) => getCaip10AddressForAccount(acc, networkId))
                .filter(Boolean) as string[]
        )

        // TODO: Upgrade to this set operation once we upgade node to v22+
        this.trackedNetworkAddresses.update((state) => {
            newNetworkAddressesToTrack.forEach((address) => state.add(address))
            return state
        })
    }

    async refreshAllSubscriptionsAndNotificationsForTrackedAccounts(): Promise<void> {
        this.subscriptionsPerAddress.set({})
        this.notificationsPerSubscription.set({})

        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/union#browser_compatibility
        // this.trackedNetworkAddresses = this.trackedNetworkAddresses.union(newNetworkAddressesToTrack)
        for (const networkAddress of get(this.trackedNetworkAddresses)) {
            await this.updateSubscriptionsAndNotificationsForNetworkAddress(networkAddress)
        }
    }

    removeTrackedNetworkAccounts(networkAddress: string): void {
        this.trackedNetworkAddresses.update((state) => {
            state.delete(networkAddress)
            return state
        })

        let subscriptionTopics: string[] = []
        this.subscriptionsPerAddress.update((state) => {
            subscriptionTopics = Object.keys(state[networkAddress] ?? {})
            state[networkAddress] = {}
            return state
        })

        this.notificationsPerSubscription.update((state) => {
            for (const subscriptionTopic of subscriptionTopics) {
                delete state[subscriptionTopic]
            }
            return state
        })
    }

    clearTrackedNetworkAccounts(): void {
        this.trackedNetworkAddresses.set(new Set())
        this.subscriptionsPerAddress.set({})
        this.notificationsPerSubscription.set({})
    }

    private async updateSubscriptionsAndNotificationsForNetworkAddress(networkAddress: string): Promise<void> {
        if (!this.notifyClient) {
            return
        }

        const activeSubscriptions = Object.values(this.notifyClient.getActiveSubscriptions({ account: networkAddress }))
        this.updateSubscriptionsPerAddress(activeSubscriptions)

        try {
            await this.updateNotificationsForSubscriptions(activeSubscriptions)
        } catch (error) {
            console.error(error)
        }
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

    private updateNotificationForSubscription(
        partialNotification: PartialWithId<NotifyClientTypes.NotifyNotification>,
        subscriptionTopic: string
    ): void {
        this.notificationsPerSubscription.update((state) => {
            const notificationsForTopic = state[subscriptionTopic]
            if (!notificationsForTopic) {
                return state
            }

            const updatedNotifications = notificationsForTopic.map((notification) => {
                if (notification.id === partialNotification.id) {
                    return { ...notification, ...partialNotification }
                }
                return notification
            })

            state[subscriptionTopic] = updatedNotifications
            return state
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

    async subscribeToDapp(appDomain: string, account: IAccountState, networkId: EvmNetworkId): Promise<boolean> {
        if (!this.notifyClient) {
            return false
        }

        const caip10Address = getCaip10AddressForAccount(account, networkId)
        if (!caip10Address) {
            return false
        }

        return await this.notifyClient.subscribe({ appDomain, account: caip10Address })
    }

    async subscribeToBloom(account: IAccountState, networkId: EvmNetworkId): Promise<void> {
        try {
            await this.subscribeToDapp(APP_DOMAIN, account, networkId)
            void this.refreshAllSubscriptionsAndNotificationsForTrackedAccounts()
        } catch (error) {
            console.error('Error subscribing to dapp', error)
        }
    }

    async markAsRead(notificationId: string, subscriptionTopic: string): Promise<void> {
        try {
            await this.notifyClient?.markNotificationsAsRead({
                notificationIds: [notificationId],
                topic: subscriptionTopic,
            })
            this.updateNotificationForSubscription({ id: notificationId, isRead: true }, subscriptionTopic)
        } catch (e) {
            console.error('Error marking notifications as read', e)
        }
    }
}

export const notificationsManager = new NotificationsManager()
