<script lang="ts">
    import { Button, Text } from '@bloomwalletio/ui'
    import { deleteProfile } from '@contexts/settings'
    import { localize } from '@core/i18n'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'

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

<Text type="body2" class="mb-2">{localize('views.settings.deleteProfile.title')}</Text>
<Text type="base" textColor="secondary" class="mb-6">{localize('views.settings.deleteProfile.description')}</Text>
<Button color="danger" text={localize('views.settings.deleteProfile.title')} on:click={onDeleteClick} />
