<script lang="ts">
    import { Checkbox } from '@bloomwalletio/ui'
    import { appSettings } from '@core/app/stores'
    import { localize } from '@core/i18n'
    import { Platform } from '@core/app'
    import SettingsSection from '../SettingsSection.svelte'

    let deepLinkingChecked = $appSettings.deepLinking

    $: $appSettings.deepLinking = deepLinkingChecked
    $: $appSettings.deepLinking && Platform.DeepLinkManager.checkForDeepLinkRequest()
</script>

<SettingsSection
    title={localize('views.settings.deepLinks.title')}
    description={localize('views.settings.deepLinks.description', {
        values: { appProtocol: process.env.APP_PROTOCOL },
    })}
>
    <Checkbox size="lg" textType="base" label={localize('actions.enableDeepLinks')} bind:checked={deepLinkingChecked} />
</SettingsSection>
