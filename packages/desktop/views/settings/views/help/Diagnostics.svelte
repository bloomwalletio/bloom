<script lang="ts">
    import { Button } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { openPopup, PopupId } from '@desktop/auxiliary/popup'
    import SettingsSection from '../SettingsSection.svelte'

    function onDiagnosticsClick(): void {
        openPopup({ id: PopupId.Diagnostics })
    }
</script>

<SettingsSection
    title={localize('views.settings.diagnostics.title')}
    description={localize('views.settings.diagnostics.description')}
>
    <Button on:click={onDiagnosticsClick} text={localize('views.settings.diagnostics.title')} />
</SettingsSection>
