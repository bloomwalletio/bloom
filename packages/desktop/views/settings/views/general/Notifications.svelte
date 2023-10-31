<script lang="ts">
    import { Checkbox } from '@bloomwalletio/ui'
    import { appSettings } from '@core/app/stores'
    import { localize } from '@core/i18n'
    import SettingsSection from '../SettingsSection.svelte'

    let notificationsChecked = $appSettings.notifications

    $: $appSettings.notifications = notificationsChecked
</script>

<SettingsSection
    title={localize('views.settings.notifications.title')}
    description={localize('views.settings.notifications.description')}
>
    <Checkbox
        size="lg"
        textType="base"
        label={localize('actions.enableSystemNotifications')}
        bind:checked={notificationsChecked}
    />
</SettingsSection>
