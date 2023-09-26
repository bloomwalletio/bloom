<script lang="ts">
    import { Button, Text } from '@bloomwalletio/ui'
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

<div class="mb-3">
    <Text type="h4">{localize('views.settings.deleteProfile.title')}</Text>
</div>
<div class="mb-5">
    <Text type="body1" textColor="secondary">{localize('views.settings.deleteProfile.description')}</Text>
</div>
<Button color="danger" text={localize('views.settings.deleteProfile.title')} on:click={onDeleteClick} />
