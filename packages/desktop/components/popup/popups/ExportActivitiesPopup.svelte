<script lang="ts">
    import { localize } from '@core/i18n'
    import { closePopup } from '@desktop/auxiliary/popup'
    import PopupTemplate from '../PopupTemplate.svelte'

    const busy = false

    function onCancelClick(): void {
        closePopup()
    }

    function onExportClick(): void {
        // TODO: implement CSV export
    }
</script>

<PopupTemplate
    title={localize('popups.exportActivities.title')}
    description={localize('popups.exportActivities.body')}
    backButton={{
        text: localize('actions.cancel'),
        onClick: onCancelClick,
        disabled: busy,
    }}
    continueButton={{
        text: localize('actions.export'),
        onClick: onExportClick,
        disabled: busy,
    }}
    {busy}
></PopupTemplate>
