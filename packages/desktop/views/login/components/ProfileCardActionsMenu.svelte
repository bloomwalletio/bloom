<script lang="ts">
    import { IconName, Menu } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { IPersistedProfile } from '@core/profile'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'

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
</script>

<Menu
    items={[
        {
            icon: IconName.Tool2,
            title: localize('popups.profileDiagnostics.title'),
            onClick: onDiagnosticsClick,
        },
    ]}
/>
