<script lang="ts">
    import { Button } from '@bloomwalletio/ui'
    import { deleteProfile } from '@contexts/settings'
    import { localize } from '@core/i18n'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import SettingsSection from '../SettingsSection.svelte'

    function onDeleteClick(): void {
        openPopup({
            id: PopupId.Confirmation,
            props: {
                variant: 'danger',
                title: localize('popups.deleteProfile.title'),
                alert: { variant: 'warning', text: localize('popups.deleteProfile.confirmation') },
                confirmText: localize('actions.delete'),
                onConfirm: deleteProfile,
            },
        })
    }
</script>

<SettingsSection
    title={localize('views.settings.deleteProfile.title')}
    description={localize('views.settings.deleteProfile.description')}
>
    <Button color="danger" text={localize('views.settings.deleteProfile.title')} on:click={onDeleteClick} />
</SettingsSection>
