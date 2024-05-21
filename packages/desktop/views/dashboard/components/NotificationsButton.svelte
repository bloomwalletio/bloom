<script lang="ts">
    import { notificationsManager } from '@auxiliary/wallet-connect/notifications'
    import { Button, IconButton, IconName, Indicator, Popover, Tabs, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { NotificationTile } from '@ui'
    import { NotifyClientTypes } from '@walletconnect/notify-client'

    const TABS = [ { key: 'all', value: 'All' }, { key: 'unread', value: 'Unread' } ]

    let selectedTab = TABS[0]

    let notifications: NotifyClientTypes.NotifyNotification[] = [{
        title: 'This is a long notification title that should be truncated at some point',
        sentAt: new Date().getTime() - 10000000,
        body: 'This is a very long notification text that should be truncated at some point in the future',
        id: '1230',
        url: 'https://stackoverflow.com/questions/28798330/arrow-functions-and-this',
        isRead: true,
        type: 'w',
    }]

    $: notificationsToDisplay = new Array(10).fill(notifications[0]).filter(notification => selectedTab.key === 'unread' ? !notification.isRead : notification).slice(0, 5)

    let anchor: HTMLElement | undefined = undefined
    let popover: Popover | undefined = undefined

    const { notificationsPerSubscription } = notificationsManager

    $: console.log($notificationsPerSubscription)
</script>

<button bind:this={anchor} class="relative flex items-center">
    <IconButton
        icon={IconName.Bell}
        tooltip={localize('views.notifications.title')}
        textColor="primary"
        size="sm"
    />
    {#if notifications.some(notification => !notification.isRead)}
        <Indicator size='sm' class="absolute top-0 right-0 box-content rounded-full
            border-2 border-solid border-surface dark:border-surface-dark"
        />
    {/if}
</button>

<Popover
    bind:this={popover}
    {anchor}
    event="click"
    placement="bottom-start"
    preventClose
>
    <div
        class="flex flex-col justify-center items-center border border-solid border-stroke dark:border-stroke-dark rounded-xl w-80
        shadow-lg overflow-hidden divide-y divide-solid divide-stroke dark:divide-stroke-dark bg-surface dark:bg-surface-dark">
        <div class="w-full">
            <Tabs bind:selectedTab tabs={TABS} />
        </div>
        {#if notificationsToDisplay.length}
            {#each notificationsToDisplay as notification}
                <NotificationTile {notification} />
            {/each}
        {:else}
            <div class="px-3 py-8 w-full">
                <Text align="center">Notifications empty</Text>
            </div>
        {/if}
        <div class="p-3 w-full">
            <Button size="xs" text="View all notifications" width="full" />
        </div>
    </div>
</Popover>
