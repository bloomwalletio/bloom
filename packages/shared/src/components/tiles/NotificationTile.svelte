<script lang="ts">
    import { notificationsManager } from '@auxiliary/wallet-connect/notifications'
    import { Icon, IconName, Text, Tile } from '@bloomwalletio/ui'
    import { getBestTimeDuration } from '@core/utils'
    import { NotifyClientTypes } from '@walletconnect/notify-client'

    export let notification: NotifyClientTypes.NotifyNotification
    export let subscriptionTopic: string

    $: subscription = notificationsManager.getSubscriptionsForTopic(subscriptionTopic)
</script>

<Tile class="!rounded-none">
    <div class="flex justify-between gap-2 w-full">
        <icon-container
            class="w-12 h-12 flex justify-center items-center rounded-xl shrink-0"
            style:background-color={'#fff'}
        >
            {#if subscription?.metadata?.icons[0] && subscription?.scope[notification.type]?.imageUrls?.sm}
                <div class="relative">
                    <img src={subscription.metadata.icons[0]} alt="icon" class="w-10 h-10 rounded-md" />
                    <img
                        src={subscription.scope[notification.type]?.imageUrls.sm}
                        alt="icon"
                        class="absolute -right-1 -bottom-1 w-4 h-4 rounded-full"
                    />
                </div>
            {:else}
                <Icon name={IconName.Bell} customColor={'brand'} size="sm" />
            {/if}
        </icon-container>
        <div class="flex-grow flex flex-col items-start">
            <div class="flex justify-between items-center gap-2">
                <Text type="sm" lineClamp={1}>{notification.title}</Text>
                <Text type="xs" fontWeight="normal"
                    >{getBestTimeDuration(new Date().getTime() - notification.sentAt, 'day', true)}</Text
                >
            </div>
            <Text type="xs" fontWeight="normal" lineClamp={2}>{notification.body}</Text>
        </div>
    </div>
</Tile>
