<script lang="ts">
    import { Text } from '@ui'
    import { Button } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { openPopup, PopupId } from '@desktop/auxiliary/popup'

    function onDiagnosticsClick(): void {
        openPopup({ id: PopupId.Diagnostics })
    }
</script>

<Text type="h4" classes="mb-3">{localize('views.settings.diagnostics.title')}</Text>
<Text type="p" secondary classes="mb-5">{localize('views.settings.diagnostics.description')}</Text>
<Button on:click={onDiagnosticsClick} text={localize('views.settings.diagnostics.title')} />
