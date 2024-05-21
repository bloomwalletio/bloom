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
        .flatMap((subscriptionTopic) => {
            return $notifications[subscriptionTopic].map((notification) => {
                return {
                    ...notification,
                    subscriptionTopic,
                }
            })
        })
        .sort((a, b) => b.sentAt - a.sentAt)

    let anchor: HTMLElement | undefined = undefined
    let popover: Popover | undefined = undefined

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
</script>

<button bind:this={anchor} class="relative flex items-center">
    <IconButton icon={IconName.Bell} tooltip={localize('views.notifications.title')} textColor="primary" size="sm" />
    {#if notificationsToDisplay.some((notification) => !notification.isRead)}
        <Indicator
            size="sm"
            class="absolute top-0 right-0 box-content rounded-full
            border-2 border-solid border-surface dark:border-surface-dark"
        />
    {/if}
</button>

<Popover bind:this={popover} {anchor} event="click" placement="bottom-start" preventClose>
    <div
        class="flex flex-col justify-center items-center border border-solid border-stroke dark:border-stroke-dark rounded-xl w-80
        shadow-lg overflow-hidden divide-y divide-solid divide-stroke dark:divide-stroke-dark bg-surface dark:bg-surface-dark"
    >
        {#if notificationsToDisplay.length}
            <div class="w-full p-4">
                <Tabs bind:selectedTab tabs={TABS} />
            </div>
            {#each notificationsToDisplay as notification}
                <NotificationTile {notification} subscriptionTopic={notification.subscriptionTopic} />
            {/each}
            <div class="p-3 w-full">
                <Button size="xs" text="View all notifications" width="full" />
            </div>
        {:else if !isAtLeast1AccountRegistered}
            <div class="px-3 py-8 w-full flex flex-col gap-4 items-center">
                <Text type="body2" align="center">Receiving notifications not enabled</Text>
                <Button text="Enable notifications" on:click={() => enableNotifications()} />
            </div>
        {:else}
            <div class="px-3 py-8 w-full">
                <Text type="body2" align="center">Notifications empty</Text>
            </div>
        {/if}
    </div>
</Popover>
