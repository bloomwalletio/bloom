<script lang="ts">
    import { SidebarToast } from '@bloomwalletio/ui'
    import { appVersionDetails } from '@core/app/stores'
    import { localize } from '@core/i18n'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'

    const localeKey = 'views.dashboard.toasts.update'

    $: isUpToDate = $appVersionDetails.upToDate

    function onClick(): void {
        openPopup({ id: PopupId.CheckForUpdates })
    }
</script>

<SidebarToast
    open={isUpToDate}
    color="green"
    header={localize(`${localeKey}.header`)}
    body={localize(`${localeKey}.body`)}
    button={{
        text: localize(`${localeKey}.button`),
        onClick,
    }}
/>
