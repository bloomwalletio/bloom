<script lang="ts">
    import { notificationsManager } from '@auxiliary/wallet-connect/notifications'
    import { IconButton, IconName, Indicator } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import NotificationsPopoverContent from '../components/NotificationsPopoverContent.svelte'

    const notifications = notificationsManager.notificationsPerSubscription
    $: hasUnreadNotifications = Object.values($notifications).some((notifications) =>
        notifications.some((notification) => !notification.isRead)
    )

    let anchor: HTMLElement | undefined = undefined
</script>

<button bind:this={anchor} type="button" class="relative flex items-center">
    <IconButton
        icon={IconName.Bell}
        tooltip={localize('views.dashboard.dappNotifications.title')}
        textColor="primary"
        size="sm"
    />
    {#if hasUnreadNotifications}
        <Indicator
            size="sm"
            class="absolute top-0 right-0 box-content rounded-full
            border-2 border-solid border-surface dark:border-surface-dark"
        />
    {/if}
</button>

<NotificationsPopoverContent {anchor} />
