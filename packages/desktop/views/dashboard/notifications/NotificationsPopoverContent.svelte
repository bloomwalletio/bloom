<script lang="ts">
    import { notificationsManager } from '@auxiliary/wallet-connect/notifications'
    import { Button, Popover, Text } from '@bloomwalletio/ui'
    import { selectedAccount } from '@core/account/stores'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { LedgerAppName } from '@core/ledger/enums'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { activeAccounts } from '@core/profile/stores'
    import { NotificationTile } from '@ui'
    import VirtualList from '@sveltejs/svelte-virtual-list'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import { NotifyClientTypes } from '@walletconnect/notify-client'
    import { getEvmNetworks } from '@core/network'

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

    $: isAtLeast1AccountRegistered = $activeAccounts.some((account) =>
        evmNetworks.some((evmNetwork) => notificationsManager.isRegistered(account, evmNetwork))
    )

    async function enableNotifications(): Promise<void> {
        if (!$selectedAccount) {
            return
        }

        try {
            await checkActiveProfileAuth(LedgerAppName.Ethereum)
        } catch (error) {
            return
        }

        try {
            for (const evmNetwork of evmNetworks) {
                await notificationsManager.registerAccount($selectedAccount, evmNetwork)
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
                        }, 1000)
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
</script>

<Popover {anchor} event="click" placement="bottom-start" preventClose on:visibilityChange={onVisibilityChange}>
    {@const notificationHeight = 76}
    <div
        class="flex flex-col justify-center items-center border border-solid border-stroke dark:border-stroke-dark rounded-xl w-80
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
            <div class="px-3 py-8 w-full flex flex-col gap-4 items-center">
                <Text type="body2" align="center">{localize('views.dashboard.dappNotifications.notEnabledHint')}</Text>
                <Button
                    text={localize('views.dashboard.dappNotifications.enable')}
                    on:click={() => enableNotifications()}
                />
            </div>
        {:else}
            <div class="px-3 py-8 w-full">
                <Text type="body2" align="center">{localize('views.dashboard.dappNotifications.empty')}</Text>
            </div>
        {/if}
    </div>
</Popover>

<style lang="postcss">
    virtual-list-wrapper {
        height: min(75vh, var(--notification-height) * var(--notification-count) * 1px);
    }
</style>
