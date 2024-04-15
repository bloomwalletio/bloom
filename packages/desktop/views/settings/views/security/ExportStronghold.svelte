<script lang="ts">
    import { Button } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { ProfileAuthPopupId, openProfileAuthPopup } from '@desktop/auxiliary/popup'
    import { exportStronghold } from '@contexts/settings'
    import SettingsSection from '../SettingsSection.svelte'

    let busy = false

    function handleExportStrongholdResponse(): void {
        busy = false
    }

    function onExportClick(): void {
        busy = false

        openProfileAuthPopup({
            id: ProfileAuthPopupId.UnlockStronghold,
            props: {
                onSuccess: (password: string) => {
                    busy = true
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
