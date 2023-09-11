<script lang="ts">
    import { Icon } from '@auxiliary/icon'
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
    } from '@core/network'
    import { profiles } from '@core/profile/stores'
    import features from '@features/features'
    import { OnboardingButton, Text } from '@ui'
    import { onMount } from 'svelte'
    import { networkSetupRouter } from '../network-setup-router'

    let networkIcon: { [key in OnboardingNetworkType]: string }
    $: networkIcon = {
        [OnboardingNetworkType.Shimmer]: Icon.Shimmer,
        [OnboardingNetworkType.Testnet]: 'settings',
        [OnboardingNetworkType.Custom]: 'settings',
    }

    $: networkIconColor = {
        [OnboardingNetworkType.Shimmer]: 'shimmer-highlight',
        [OnboardingNetworkType.Testnet]: 'blue-500',
        [OnboardingNetworkType.Custom]: 'blue-500',
    }

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
    {onContinueClick}
    {onBackClick}
    disableBack={$profiles.length === 0}
>
    <div slot="leftpane__content">
        <Text secondary classes="mb-8">{localize('views.onboarding.networkSetup.chooseNetwork.body')}</Text>
    </div>
    <div slot="content" class="flex flex-col space-y-4">
        {#each Object.values(OnboardingNetworkType) as networkType}
            <OnboardingButton
                primaryText={localize(`views.onboarding.networkSetup.chooseNetwork.${networkType}.title`)}
                secondaryText={localize(`views.onboarding.networkSetup.chooseNetwork.${networkType}.body`)}
                icon={networkIcon[networkType]}
                iconColor={networkIconColor[networkType]}
                hidden={features?.onboarding?.[networkType]?.hidden}
                disabled={!features?.onboarding?.[networkType]?.enabled}
                onClick={() => onNetworkClick(networkType)}
                selected={selectedNetworkType === networkType}
            />
        {/each}
    </div>
</OnboardingLayout>
