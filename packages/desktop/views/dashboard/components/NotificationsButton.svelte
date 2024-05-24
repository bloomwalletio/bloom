<script lang="ts">
    import { notificationsManager } from '@auxiliary/wallet-connect/notifications'
    import { Button, IconButton, IconName, Indicator, Popover, Tabs, Text } from '@bloomwalletio/ui'
    import { selectedAccount } from '@core/account/stores'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { LedgerAppName } from '@core/ledger/enums'
    import { SupportedNetworkId, getEvmNetwork } from '@core/network'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { activeAccounts } from '@core/profile/stores'
    import { NotificationTile } from '@ui'

    const TABS = [
        { key: 'all', value: 'All' },
        { key: 'unread', value: 'Unread' },
    ]

    let selectedTab = TABS[0]

    const evmNetwork = getEvmNetwork(SupportedNetworkId.Ethereum)
    const notifications = notificationsManager.notificationsPerSubscription
    $: notificationsToDisplay = Object.keys($notifications)
        .flatMap((subscriptionTopic) =>
            $notifications[subscriptionTopic].map((notification) => ({
                ...notification,
                subscriptionTopic,
            }))
        )
        .sort((a, b) => b.sentAt - a.sentAt)
        .filter((notification) => (selectedTab.key === 'unread' ? !notification.isRead : true))

    let anchor: HTMLElement | undefined = undefined

    $: isAtLeast1AccountRegistered =
        evmNetwork && $activeAccounts.some((account) => notificationsManager.isRegistered(account, evmNetwork))

    async function enableNotifications(): Promise<void> {
        try {
            await checkActiveProfileAuth(LedgerAppName.Ethereum)
        } catch (error) {
            return
        }

        try {
            if ($selectedAccount && evmNetwork) {
                notificationsManager.registerAccount($selectedAccount, evmNetwork)
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
                    const { id, topic } = element.dataset
                    if (id && topic) {
                        void notificationsManager.markAsRead([id], topic)
                        observedElements.delete(element)
                    }
                }
            })
        },
        { threshold: 0.5 }
    )

    function observe(node: HTMLElement): void {
        const isRead = node.dataset.isread === 'true'
        if (!isRead) {
            observedElements.add(node)
        }
    }

    function toggleObserve(): void {
        observedElements.forEach((element) => {
            observer.unobserve(element)
            observer.observe(element)
        })
    }

    function onVisibilityChange({ detail }: CustomEvent): void {
        if (detail.visible) {
            toggleObserve()
        } else {
            notificationsManager.updateAllSubscriptionsAndNotifications()
        }
    }
</script>

<button bind:this={anchor} type="button" class="relative flex items-center">
    <IconButton
        icon={IconName.Bell}
        tooltip={localize('views.dashboard.dappNotifications.title')}
        textColor="primary"
        size="sm"
    />
    {#if notificationsToDisplay.some((notification) => !notification.isRead)}
        <Indicator
            size="sm"
            class="absolute top-0 right-0 box-content rounded-full
            border-2 border-solid border-surface dark:border-surface-dark"
        />
    {/if}
</button>

<Popover {anchor} event="click" placement="bottom-start" preventClose on:visibilityChange={onVisibilityChange}>
    {@const hasNotifications = Object.keys($notifications).flat().length > 0}
    <div
        class="flex flex-col justify-center items-center border border-solid border-stroke dark:border-stroke-dark rounded-xl w-80
        shadow-lg overflow-hidden divide-y divide-solid divide-stroke dark:divide-stroke-dark bg-surface dark:bg-surface-dark"
    >
        {#if isAtLeast1AccountRegistered && hasNotifications}
            <div class="w-full p-4">
                <Tabs bind:selectedTab tabs={TABS} />
            </div>
        {/if}
        {#if notificationsToDisplay.length}
            <ul
                class="flex flex-col divide-y divide-solid divide-stroke dark:divide-stroke-dark w-full max-h-[75vh] overflow-y-scroll"
            >
                {#each notificationsToDisplay as notification (notification.id)}
                    <li
                        data-id={notification.id}
                        data-topic={notification.subscriptionTopic}
                        data-isread={notification.isRead}
                        use:observe
                    >
                        <NotificationTile {notification} subscriptionTopic={notification.subscriptionTopic} />
                    </li>
                {/each}
            </ul>
        {:else if !isAtLeast1AccountRegistered}
            <div class="px-3 py-8 w-full flex flex-col gap-4 items-center">
                <Text type="body2" align="center">{localize('views.dashboard.dappNotifications.notEnabledHint')}</Text>
                <Button
                    text={localize('views.dashboard.dappNotifications.enable')}
                    on:click={() => enableNotifications()}
                />
            </div>
        {:else if hasNotifications}
            <div class="px-3 py-8 w-full">
                <Text type="body2" align="center">{localize('views.dashboard.dappNotifications.empty')}</Text>
            </div>
        {/if}
    </div>
</Popover>
