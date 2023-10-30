<script lang="ts">
    import { Checkbox, Text } from '@bloomwalletio/ui'
    import { appSettings } from '@core/app/stores'
    import { localize } from '@core/i18n'

    let notificationsChecked = $appSettings.notifications

    $: $appSettings.notifications = notificationsChecked
</script>

<Text type="body2" class="mb-2">{localize('views.settings.notifications.title')}</Text>
<Text type="base" textColor="secondary" class="mb-6">{localize('views.settings.notifications.description')}</Text>
<Checkbox
    size="lg"
    textType="base"
    label={localize('actions.enableSystemNotifications')}
    bind:checked={notificationsChecked}
/>
