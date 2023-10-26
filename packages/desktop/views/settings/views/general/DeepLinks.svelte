<script lang="ts">
    import { Checkbox, Text } from '@bloomwalletio/ui'
    import { appSettings } from '@core/app/stores'
    import { localize } from '@core/i18n'
    import { Platform } from '@core/app'

    let deepLinkingChecked = $appSettings.deepLinking

    $: $appSettings.deepLinking = deepLinkingChecked
    $: $appSettings.deepLinking && Platform.DeepLinkManager.checkForDeepLinkRequest()
</script>

<Text type="body2" class="mb-2">{localize('views.settings.deepLinks.title')}</Text>
<Text type="base" textColor="secondary" class="mb-6"
    >{localize('views.settings.deepLinks.description', { values: { appProtocol: process.env.APP_PROTOCOL } })}</Text
>
<Checkbox label={localize('actions.enableDeepLinks')} bind:checked={deepLinkingChecked} />
