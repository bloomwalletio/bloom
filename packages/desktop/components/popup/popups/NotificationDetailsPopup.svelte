<script lang="ts">
    import { Pill, Text } from '@bloomwalletio/ui'
    import { openUrlInBrowser } from '@core/app/utils'
    import { formatDate, localize } from '@core/i18n'
    import { NotificationSubscriptionInfo } from '@ui'
    import { NotifyClientTypes } from '@walletconnect/notify-client'
    import PopupTemplate from '../PopupTemplate.svelte'

    export let notification: NotifyClientTypes.NotifyNotification
    export let subscription: NotifyClientTypes.NotifySubscription

    $: notificationType = subscription?.scope[notification.type]

    function onVisitClick(url: string): void {
        openUrlInBrowser(url)
    }
</script>

<PopupTemplate
    continueButton={notification.url
        ? {
              text: localize('actions.visit'),
              onClick: () => onVisitClick(notification.url ?? ''),
          }
        : undefined}
>
    <NotificationSubscriptionInfo
        slot="banner"
        metadata={subscription.metadata}
        classes="bg-surface-1 dark:bg-surface-1-dark pb-4"
    ></NotificationSubscriptionInfo>

    <div class="space-y-2">
        <div class="flex flex-row items-center justify-between gap-2">
            <Pill compact color="primary">{notificationType.name}</Pill>
            <Text size="sm" textColor="secondary">
                {formatDate(new Date(notification.sentAt), { dateStyle: 'long', timeStyle: 'short' })}
            </Text>
        </div>
        <div class="space-y-1">
            <Text type="body1">{notification.title}</Text>
            <Text type="sm" textColor="secondary">{notification.body}</Text>
        </div>
    </div>
</PopupTemplate>
