<script lang="ts">
    import { IconName, Menu } from '@bloomwalletio/ui'
    import { deleteProfile } from '@contexts/settings/actions'
    import { localize } from '@core/i18n'
    import { IPersistedProfile } from '@core/profile'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'

    export let profile: IPersistedProfile

    function onDiagnosticsClick(): void {
        openPopup(
            {
                id: PopupId.ProfileDiagnostics,
                props: {
                    profile,
                },
            },
            false,
            false
        )
    }

    function onDeleteClick(): void {
        openPopup(
            {
                id: PopupId.Confirmation,
                props: {
                    variant: 'danger',
                    title: localize('popups.deleteProfile.title', { name: profile.name }),
                    alert: { variant: 'warning', text: localize('popups.deleteProfile.confirmation') },
                    confirmText: localize('actions.delete'),
                    onConfirm: () => {
                        deleteProfile(profile.id)
                        closePopup()
                    },
                },
            },
            false,
            false
        )
    }
</script>

<Menu
    items={[
        {
            icon: IconName.Tool2,
            title: localize('popups.profileDiagnostics.title'),
            onClick: onDiagnosticsClick,
        },
        {
            variant: 'danger',
            icon: IconName.Trash,
            title: localize('views.settings.deleteProfile.title'),
            onClick: onDeleteClick,
        },
    ]}
/>
