<script lang="ts">
    import { OnboardingLayout } from '@components'
    import {
        OnboardingNetworkType,
        initialiseOnboardingProfile,
        onboardingProfile,
        updateOnboardingProfile,
    } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import {
        NetworkId,
        NetworkNamespace,
        StardustNetworkName,
        getDefaultClientOptions,
        getDefaultPersistedNetwork,
        getNetworkIdFromOnboardingNetworkType,
    } from '@core/network'
    import { profiles } from '@core/profile/stores'
    import features from '@features/features'
    import NetworkAvatar from '@ui/avatars/NetworkAvatar.svelte'
    import { onMount } from 'svelte'
    import { OnboardingSelectorTile } from '../../../components'
    import { networkSetupRouter } from '../network-setup-router'

    let selectedNetworkType: OnboardingNetworkType = OnboardingNetworkType.Shimmer
    function onNetworkClick(networkType: OnboardingNetworkType): void {
        selectedNetworkType = networkType
    }

    function onContinueClick(): void {
        if (selectedNetworkType !== OnboardingNetworkType.Custom) {
            const networkName = getNetworkNameFromOnboardingNetworkType(selectedNetworkType)
            const networkId: NetworkId = `${NetworkNamespace.Stardust}:${networkName}`
            const network = getDefaultPersistedNetwork(networkId)
            const clientOptions = getDefaultClientOptions(networkId)
            updateOnboardingProfile({ network, clientOptions })
        }
        $networkSetupRouter.next()
    }

    function getNetworkNameFromOnboardingNetworkType(
        networkType: OnboardingNetworkType
    ): StardustNetworkName | undefined {
        switch (networkType) {
            case OnboardingNetworkType.Shimmer:
                return StardustNetworkName.Shimmer
            case OnboardingNetworkType.Testnet:
                return StardustNetworkName.Testnet
            case OnboardingNetworkType.Custom:
                return undefined
        }
    }

    function onBackClick(): void {
        $networkSetupRouter.previous()
    }

    onMount(async () => {
        // Clean up if user has navigated back to this view
        updateOnboardingProfile({ network: undefined, clientOptions: undefined })
        // If coming from this view with no profiles, initialise a new profile
        if (!$onboardingProfile?.id) {
            await initialiseOnboardingProfile()
        }
    })
</script>

<OnboardingLayout
    title={localize('views.onboarding.networkSetup.chooseNetwork.title')}
    description={localize('views.onboarding.networkSetup.chooseNetwork.body')}
    continueButton={{
        onClick: onContinueClick,
        disabled: !selectedNetworkType,
    }}
    backButton={{
        onClick: onBackClick,
        hidden: $profiles.length === 0,
    }}
>
    <div slot="content" class="flex flex-col space-y-4">
        <OnboardingSelectorTile
            primaryText={localize(`views.onboarding.networkSetup.chooseNetwork.${OnboardingNetworkType.Shimmer}.title`)}
            secondaryText={localize(
                `views.onboarding.networkSetup.chooseNetwork.${OnboardingNetworkType.Shimmer}.body`
            )}
            hidden={features?.onboarding?.[OnboardingNetworkType.Shimmer]?.hidden}
            disabled={!features?.onboarding?.[OnboardingNetworkType.Shimmer]?.enabled}
            onClick={() => onNetworkClick(OnboardingNetworkType.Shimmer)}
            selected={selectedNetworkType === OnboardingNetworkType.Shimmer}
        >
            <div slot="icon">
                <NetworkAvatar networkId={getNetworkIdFromOnboardingNetworkType(OnboardingNetworkType.Shimmer)} />
            </div>
        </OnboardingSelectorTile>
        <OnboardingSelectorTile
            primaryText={localize(`views.onboarding.networkSetup.chooseNetwork.${OnboardingNetworkType.Testnet}.title`)}
            secondaryText={localize(
                `views.onboarding.networkSetup.chooseNetwork.${OnboardingNetworkType.Testnet}.body`
            )}
            hidden={features?.onboarding?.[OnboardingNetworkType.Testnet]?.hidden}
            disabled={!features?.onboarding?.[OnboardingNetworkType.Testnet]?.enabled}
            onClick={() => onNetworkClick(OnboardingNetworkType.Testnet)}
            selected={selectedNetworkType === OnboardingNetworkType.Testnet}
        >
            <div slot="icon">
                <NetworkAvatar networkId={getNetworkIdFromOnboardingNetworkType(OnboardingNetworkType.Testnet)} />
            </div>
        </OnboardingSelectorTile>
        <OnboardingSelectorTile
            primaryText={localize(`views.onboarding.networkSetup.chooseNetwork.${OnboardingNetworkType.Custom}.title`)}
            secondaryText={localize(`views.onboarding.networkSetup.chooseNetwork.${OnboardingNetworkType.Custom}.body`)}
            icon="settings"
            iconColor="settings"
            hidden={features?.onboarding?.[OnboardingNetworkType.Custom]?.hidden}
            disabled={!features?.onboarding?.[OnboardingNetworkType.Custom]?.enabled}
            onClick={() => onNetworkClick(OnboardingNetworkType.Custom)}
            selected={selectedNetworkType === OnboardingNetworkType.Custom}
        />
    </div>
</OnboardingLayout>
