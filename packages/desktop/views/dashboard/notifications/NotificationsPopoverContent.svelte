<script lang="ts">
    import { notificationsManager } from '@auxiliary/wallet-connect/notifications'
    import { Button, IconName, Popover } from '@bloomwalletio/ui'
    import { EmptyListPlaceholder } from '@components'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { LedgerAppName } from '@core/ledger/enums'
    import { getEvmNetworks } from '@core/network'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { activeAccounts } from '@core/profile/stores'
    import { MILLISECONDS_PER_SECOND } from '@core/utils'
    import { PopupId, openPopup, popupState } from '@desktop/auxiliary/popup'
    import VirtualList from '@sveltejs/svelte-virtual-list'
    import { NotificationTile } from '@ui'
    import { NotifyClientTypes } from '@walletconnect/notify-client'

    type NotificationWithSubscription = NotifyClientTypes.NotifyNotification & { subscriptionTopic: string }
    type DataItem = { item: string }

    export let anchor: HTMLElement | undefined = undefined

    const evmNetworks = getEvmNetworks()
    const notifications = notificationsManager.notificationsPerSubscription
    $: notificationsToDisplay = Object.keys($notifications)
        .flatMap((subscriptionTopic) =>
            $notifications[subscriptionTopic].map((notification) => ({
                ...notification,
                subscriptionTopic,
            }))
        )
        .sort((a, b) => b.sentAt - a.sentAt) as NotificationWithSubscription[]

    // Register for account index 0 only
    $: notificationAccount = $activeAccounts[0]

    const trackedNetworkAddresses = notificationsManager.trackedNetworkAddresses
    let isAtLeast1AccountRegistered = false
    $: $trackedNetworkAddresses, (isAtLeast1AccountRegistered = hasNotificationAccountRegisteredOnSomeNetworks())

    function hasNotificationAccountRegisteredOnSomeNetworks(): boolean {
        return evmNetworks.some((evmNetwork) => notificationsManager.isRegistered(notificationAccount, evmNetwork))
    }

    async function enableNotifications(): Promise<void> {
        try {
            await checkActiveProfileAuth(LedgerAppName.Ethereum)
        } catch (error) {
            return
        }

        if (!notificationAccount) {
            return
        }

        try {
            for (const evmNetwork of evmNetworks) {
                await notificationsManager.registerAccount(notificationAccount, evmNetwork)
            }
        } catch (err) {
            handleError(err)
        }
    }

    async function markAsRead(notification: NotifyClientTypes.NotifyNotification, topic: string): Promise<void> {
        try {
            if (!notification.isRead) {
                await notificationsManager.markAsRead(notification.id, topic)
            }
        } catch (err) {
            handleError(err)
        }
    }

    const observedElements = new Set<HTMLElement>()

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const element = entry.target as HTMLElement
                const isVisible = element.checkVisibility({ checkOpacity: true })
                if (isVisible && entry.isIntersecting) {
                    const { item } = element.dataset as DataItem
                    const notification = JSON.parse(item) as NotificationWithSubscription

                    if (notification) {
                        setTimeout(() => {
                            void markAsRead(notification, notification.subscriptionTopic)
                            observedElements.delete(element)
                        }, 2 * MILLISECONDS_PER_SECOND)
                    }
                }
            })
        },
        { threshold: 0.5 }
    )

    function checkIfWeShouldObserveElement(node: HTMLElement): void {
        const { item } = node.dataset as DataItem
        const notification = JSON.parse(item) as NotificationWithSubscription

        if (!notification?.isRead) {
            observedElements.add(node)
            if (open) {
                observer.observe(node)
            }
        }
    }

    function observeAll(): void {
        observedElements.forEach((element) => {
            observer.observe(element)
        })
    }

    function unobserveAll(): void {
        observedElements.forEach((element) => {
            observer.unobserve(element)
        })
    }

    let open = false
    function onVisibilityChange({ detail }: CustomEvent): void {
        open = detail.visible
        if (detail.visible) {
            observeAll()
        } else {
            unobserveAll()
        }
    }

    function onNotificationClick(
        notification: NotifyClientTypes.NotifyNotification,
        subscription?: NotifyClientTypes.NotifySubscription
    ): void {
        void markAsRead(notification, subscription?.topic)
        openPopup({
            id: PopupId.NotificationDetails,
            props: {
                notification,
                subscription,
            },
        })
    }

    $: preventClose = $popupState.active && $popupState.id === PopupId.NotificationDetails
</script>

<Popover
    {anchor}
    event="click"
    placement="bottom-start"
    {preventClose}
    preventCloseOnElement
    on:visibilityChange={onVisibilityChange}
>
    {@const notificationHeight = 76}
    <div
        class="min-h-96 flex flex-col justify-center items-center border border-solid border-stroke dark:border-stroke-dark rounded-xl w-80
        shadow-lg overflow-hidden divide-y divide-solid divide-stroke dark:divide-stroke-dark bg-surface dark:bg-surface-dark"
    >
        {#if notificationsToDisplay.length}
            <virtual-list-wrapper
                class="w-full"
                style:--notification-height={notificationHeight}
                style:--notification-count={notificationsToDisplay.length}
            >
                {#key notificationsToDisplay}
                    <VirtualList items={notificationsToDisplay} let:item itemHeight={notificationHeight}>
                        <div
                            data-item={JSON.stringify(item)}
                            style:height={notificationHeight + 'px'}
                            class="border-b border-solid border-stroke dark:border-stroke-dark"
                            use:checkIfWeShouldObserveElement
                        >
                            <NotificationTile
                                notification={item}
                                subscriptionTopic={item.subscriptionTopic}
                                onClick={onNotificationClick}
                            />
                        </div>
                    </VirtualList>
                {/key}
            </virtual-list-wrapper>
        {:else if !isAtLeast1AccountRegistered}
            <div class="flex flex-col px-3 py-8 w-full items-center justify-center">
                <EmptyListPlaceholder
                    subtitle={localize('views.dashboard.dappNotifications.notEnabledHint')}
                    icon={IconName.BellRinging}
                />
            </div>

            <Button
                size="sm"
                text={localize('views.dashboard.dappNotifications.enable')}
                on:click={() => enableNotifications()}
            />
        {:else}
            <div class="flex flex-col min-h-96 px-3 py-8 w-full items-center justify-center">
                <EmptyListPlaceholder
                    subtitle={localize('views.dashboard.dappNotifications.empty')}
                    icon={IconName.Bell}
                />
            </div>
        {/if}
    </div>
</Popover>

<style lang="postcss">
    virtual-list-wrapper {
        @apply min-h-96;
        height: min(75vh, var(--notification-height) * var(--notification-count) * 1px);
    }
</style>
