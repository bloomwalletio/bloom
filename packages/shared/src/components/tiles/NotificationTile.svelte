<script lang="ts">
    import { notificationsManager } from '@auxiliary/wallet-connect/notifications'
    import { Indicator, Text, Tile } from '@bloomwalletio/ui'
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
    class="h-full items-center !rounded-none !hover:"
    surface={0}
    backgroundColor={notification.isRead ? undefined : 'brand/05'}
    onClick={() => onClick(notification, subscription)}
>
    <div class="flex justify-between gap-4 w-full">
        <NotificationAvatar {subscription} notificationType={notification.type} />
        <div class="flex-grow flex flex-col items-start">
            <div class="w-full flex justify-between items-center gap-2">
                <div class="flex items-center gap-2">
                    <Text type="sm" lineClamp={1}>{notification.title}</Text>
                </div>
                {#if !notification.isRead}
                    <Indicator size="sm" />
                {:else}
                    <Text type="xs" fontWeight="normal">
                        {getBestTimeDuration($time.getTime() - notification.sentAt, 'day', true)}
                    </Text>
                {/if}
            </div>
            <div class="w-full flex justify-between gap-2">
                <Text type="xs" fontWeight="normal" lineClamp={2}>{notification.body}</Text>
            </div>
        </div>
    </div>
</Tile>
