<script lang="ts">
    import { Button, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { openPopup, PopupId } from '@desktop/auxiliary/popup'

    function onDiagnosticsClick(): void {
        openPopup({ id: PopupId.Diagnostics })
    }
</script>

<Text type="body2" class="mb-2">{localize('views.settings.diagnostics.title')}</Text>
<Text type="base" textColor="secondary" class="mb-6">{localize('views.settings.diagnostics.description')}</Text>
<Button on:click={onDiagnosticsClick} text={localize('views.settings.diagnostics.title')} />
