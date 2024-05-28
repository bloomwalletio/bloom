<script lang="ts">
    import { notificationsManager } from '@auxiliary/wallet-connect/notifications'
    import { Link, Indicator, Text, Tile } from '@bloomwalletio/ui'
    import { time } from '@core/app/stores'
    import { getBestTimeDuration } from '@core/utils'
    import { NotificationAvatar } from '@ui/avatars'
    import { NotifyClientTypes } from '@walletconnect/notify-client'

    export let notification: NotifyClientTypes.NotifyNotification
    export let subscriptionTopic: string
    export let onClick: (
        notification: NotifyClientTypes.NotifyNotification,
        subscription?: NotifyClientTypes.NotifySubscription
    ) => void

    $: subscription = notificationsManager.getSubscriptionsForTopic(subscriptionTopic)
</script>

<Tile
    class="h-full items-center !rounded-none {notification.isRead ? '' : '!bg-brand/5 !dark:bg-brand-dark/5'}"
    onClick={() => onClick(notification, subscription)}
>
    <div class="flex justify-between gap-4 w-full">
        <NotificationAvatar {subscription} notificationType={notification.type} />
        <div class="flex-grow flex flex-col items-start">
            <div class="w-full flex justify-between gap-2">
                <div class="flex items-center gap-2">
                    <Text type="sm" lineClamp={1}>{notification.title}</Text>
                    {#if notification.url}
                        <Link textType="xs" href={notification.url} external />
                    {/if}
                </div>
                {#if !notification.isRead}
                    <Indicator size="sm" />
                {/if}
            </div>
            <div class="w-full flex justify-between gap-2">
                <Text type="xs" fontWeight="normal" lineClamp={2}>{notification.body}</Text>
                <Text type="xs" fontWeight="normal">
                    {getBestTimeDuration($time.getTime() - notification.sentAt, 'day', true)}
                </Text>
            </div>
        </div>
    </div>
</Tile>
