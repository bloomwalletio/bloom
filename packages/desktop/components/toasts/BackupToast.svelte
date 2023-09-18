<script lang="ts">
    import { SidebarToast } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { activeProfile, isSoftwareProfile } from '@core/profile/stores'
    import { isRecentDate } from '@core/utils'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'

    $: lastStrongholdBackupTime = $activeProfile?.lastStrongholdBackupTime
    $: lastBackupDate = lastStrongholdBackupTime ? new Date(lastStrongholdBackupTime) : null
    $: requiresBackup = !lastBackupDate || !isRecentDate(lastBackupDate)?.lessThanThreeMonths

    const localeKey = 'toasts.backup'

    function onClick(): void {
        openPopup({
            id: PopupId.BackupStronghold,
        })
    }
</script>

<SidebarToast
    on:click={onClick}
    open={$isSoftwareProfile && requiresBackup}
    headerColor="yellow"
    headerText={localize(`${localeKey}.headerText`)}
    bodyText={localize(`${localeKey}.bodyText`)}
    buttonText={localize(`${localeKey}.button`)}
/>
