<script lang="ts">
    import { localize } from '@core/i18n'
    import { closePopup } from '@desktop/auxiliary/popup'
    import PopupTemplate from '../PopupTemplate.svelte'
    import { convertActvitiesToCsv } from '@core/activity/utils'
    import { allAccountActivities } from '@core/activity'
    import { activeAccounts } from '@core/profile/stores'
    import { Platform } from '@core/app/classes'
    import { handleError } from '@core/error/handlers'

    let busy = false

    function onCancelClick(): void {
        closePopup()
    }

    async function onExportClick(): Promise<void> {
        try {
            busy = true
            const content = convertActvitiesToCsv($activeAccounts, $allAccountActivities)
            await Platform.saveTextInFile('activities', 'csv', content)
            closePopup()
        } catch (err) {
            handleError(err)
        } finally {
            busy = false
        }
    }
</script>

<PopupTemplate
    title={localize('popups.exportActivities.title')}
    description={localize('popups.exportActivities.body')}
    backButton={{
        text: localize('actions.cancel'),
        onClick: onCancelClick,
    }}
    continueButton={{
        text: localize('actions.export'),
        onClick: onExportClick,
    }}
    {busy}
></PopupTemplate>
