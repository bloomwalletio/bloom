<script lang="ts">
    import PopupTemplate from '../PopupTemplate.svelte'
    import { NotifyClientTypes } from '@walletconnect/notify-client'
    import { Link, Text } from '@bloomwalletio/ui'
    import { NotificationAvatar } from '@ui/avatars'
    import { formatDate, localize } from '@core/i18n'
    import { openUrlInBrowser } from '@core/app/utils'

    export let notification: NotifyClientTypes.NotifyNotification
    export let subscription: NotifyClientTypes.NotifySubscription

    function onVisitClick(url: string): void {
        openUrlInBrowser(url)
    }
</script>

<PopupTemplate
    title={notification.title}
    description={notification.body}
    continueButton={notification.url
        ? {
              text: localize('actions.visit'),
              onClick: () => onVisitClick(notification.url ?? ''),
          }
        : undefined}
>
    <div class="flex gap-4">
        <NotificationAvatar {subscription} notificationType={notification.type} />
        <div class="flex flex-col">
            <div class="flex items-center gap-1">
                <Text>{subscription.metadata.name}</Text>
                <Link textType="xs" href={subscription.metadata.appDomain} external />
            </div>
            <Text textColor="secondary">{subscription.metadata.description}</Text>
        </div>
    </div>
    <Text textColor="secondary" align="right" class="mt-4"
        >{formatDate(new Date(notification.sentAt), { dateStyle: 'long', timeStyle: 'short' })}</Text
    >
</PopupTemplate>
