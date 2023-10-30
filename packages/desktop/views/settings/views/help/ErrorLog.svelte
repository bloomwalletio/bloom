<script lang="ts">
    import { Button } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { openPopup, PopupId } from '@desktop/auxiliary/popup'
    import SettingsSection from '../SettingsSection.svelte'

    function onErrorLogClick(): void {
        openPopup({ id: PopupId.ErrorLog })
    }
</script>

<SettingsSection
    title={localize('views.settings.errorLog.title')}
    description={localize('views.settings.errorLog.description')}
>
    <Button on:click={onErrorLogClick} text={localize('views.settings.errorLog.title')} />
</SettingsSection>
