<script lang="ts">
    import { Text } from '@ui'
    import { Button } from '@bloomwalletio/ui'
    import { deleteProfile } from '@contexts/settings'
    import { localize } from '@core/i18n'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'

    function onDeleteClick(): void {
        openPopup({
            id: PopupId.Confirmation,
            props: {
                title: localize('popups.deleteProfile.title'),
                hint: localize('popups.deleteProfile.confirmation'),
                warning: true,
                confirmText: localize('actions.delete'),
                onConfirm: deleteProfile,
            },
        })
    }
</script>

<Text type="h4" classes="mb-3">{localize('views.settings.deleteProfile.title')}</Text>
<Text type="p" secondary classes="mb-5">{localize('views.settings.deleteProfile.description')}</Text>
<Button color="red" text={localize('views.settings.deleteProfile.title')} on:click={onDeleteClick} />
