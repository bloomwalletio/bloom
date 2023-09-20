<script lang="ts">
    import { SidebarToast } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { activeProfile, isSoftwareProfile } from '@core/profile/stores'
    import { isRecentDate } from '@core/utils'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'

    $: lastStrongholdBackupTime = $activeProfile?.lastStrongholdBackupTime
    $: lastBackupDate = lastStrongholdBackupTime ? new Date(lastStrongholdBackupTime) : null
    $: requiresBackup = !lastBackupDate || !isRecentDate(lastBackupDate)?.lessThanThreeMonths

    const localeKey = 'views.dashboard.toasts.backup'

    function onClick(): void {
        openPopup({
            id: PopupId.BackupStronghold,
        })
    }
</script>

<SidebarToast
    color="yellow"
    header={localize(`${localeKey}.header`)}
    body={localize(`${localeKey}.body`)}
    button={{
        text: localize(`${localeKey}.button`),
        onClick,
    }}
    open={$isSoftwareProfile && requiresBackup}
/>
