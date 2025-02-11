<script lang="ts">
    import { IconName, Menu } from '@bloomwalletio/ui'
    import { deleteProfile } from '@contexts/settings/actions'
    import { localize } from '@core/i18n'
    import { IPersistedProfile } from '@core/profile'
    import { toggleLoginDrawer } from '@desktop/auxiliary/drawer'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'
    import { LoginDrawerRoute } from '../drawers'
    import { NetworkConfigRoute } from '@views/dashboard/drawers'
    import { setSelectedNetworkForNetworkDrawer } from '@core/network/stores'
    import { StardustNetwork } from '@core/network/classes'
    import { loadPersistedProfileIntoActiveProfile } from '@core/profile/actions'

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

    function onNodeConfigurationClick(): void {
        loadPersistedProfileIntoActiveProfile(profile.id)
        const profileNetwork = new StardustNetwork(profile.network)
        setSelectedNetworkForNetworkDrawer(profileNetwork)
        toggleLoginDrawer({
            id: LoginDrawerRoute.NetworkConfig,
            initialSubroute: NetworkConfigRoute.ChainInformation,
        })
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
            icon: IconName.Tool,
            title: 'Node configuration',
            onClick: onNodeConfigurationClick,
        },
        {
            variant: 'danger',
            icon: IconName.Trash,
            title: localize('views.settings.deleteProfile.title'),
            onClick: onDeleteClick,
        },
    ]}
/>
