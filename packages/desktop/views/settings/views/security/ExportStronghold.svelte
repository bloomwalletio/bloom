<script lang="ts">
    import { Button } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import { exportStronghold } from '@contexts/settings'
    import SettingsSection from '../SettingsSection.svelte'

    let busy = false
    let message = ''

    function handleExportStrongholdResponse(cancelled: boolean, error?: string | undefined): void {
        setTimeout(
            () => {
                message = ''
            },
            cancelled ? 0 : 5000
        )
        busy = false
        if (!cancelled) {
            if (error) {
                message = localize('general.exportingStrongholdFailed')
            } else {
                message = localize('general.exportingStrongholdSuccess')
            }
        }
    }

    function onExportClick(): void {
        busy = false
        message = ''

        openPopup({
            id: PopupId.UnlockStronghold,
            props: {
                onSuccess: (password: string) => {
                    busy = true
                    message = localize('general.exportingStronghold')
                    exportStronghold(password, handleExportStrongholdResponse)
                },
                returnPassword: true,
                subtitle: localize('popups.password.backup'),
            },
        })
    }
</script>

<SettingsSection
    title={localize('views.settings.exportStronghold.title')}
    description={localize('views.settings.exportStronghold.description')}
>
    <Button text={localize('actions.export')} {busy} disabled={busy} on:click={onExportClick} />
</SettingsSection>
