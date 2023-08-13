<script lang="ts">
    import { Icon } from '@auxiliary/icon'
    import { OnboardingLayout } from '@components'
    import { initialiseOnboardingProfile, updateOnboardingProfile, onboardingProfile } from '@contexts/onboarding'
    import { IS_MOBILE } from '@core/app'
    import { localize } from '@core/i18n'
    import { NetworkName, getDefaultClientOptions, getDefaultPersistedNetwork } from '@core/network'
    import { profiles } from '@core/profile'
    import features from '@features/features'
    import { Animation, OnboardingButton, Text, TextType } from '@ui'
    import { onMount } from 'svelte'
    import { networkSetupRouter } from '../network-setup-router'
    import { getNetworkIdFromNetworkName } from '@core/network/utils/getNetworkIdFromNetworkName'

    let networkIcon: { [key in NetworkName]: string }
    $: networkIcon = {
        [NetworkName.Iota]: Icon.Iota,
        [NetworkName.Shimmer]: Icon.Shimmer,
        [NetworkName.Testnet]: 'settings',
        [NetworkName.Custom]: 'settings',
    }

    function getIconColor(networkName: NetworkName): string {
        switch (networkName) {
            case NetworkName.Iota:
                return 'iota-highlight'
            case NetworkName.Shimmer:
                return 'shimmer-highlight'
            case NetworkName.Testnet:
                return 'blue-500'
            case NetworkName.Custom:
                return 'blue-500'
        }
    }

    function onNetworkSelectionClick(networkName: NetworkName): void {
        if (networkName !== NetworkName.Custom) {
            const networkId = getNetworkIdFromNetworkName(networkName)
            const network = getDefaultPersistedNetwork(networkId)
            const clientOptions = getDefaultClientOptions(networkId)
            updateOnboardingProfile({ network, clientOptions })
        }
        $networkSetupRouter.next()
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

<OnboardingLayout allowBack={$profiles.length > 0} {onBackClick}>
    <div slot="title">
        <Text type={TextType.h2}>{localize('views.onboarding.networkSetup.chooseNetwork.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <Text secondary classes="mb-8">{localize('views.onboarding.networkSetup.chooseNetwork.body')}</Text>
    </div>
    <div slot="leftpane__action" class="flex flex-col space-y-4">
        {#each Object.values(NetworkName) as networkName}
            <OnboardingButton
                primaryText={localize(`views.onboarding.networkSetup.chooseNetwork.${networkName}.title`)}
                secondaryText={!IS_MOBILE
                    ? localize(`views.onboarding.networkSetup.chooseNetwork.${networkName}.body`)
                    : ''}
                icon={networkIcon[networkName]}
                iconColor={getIconColor(networkName)}
                hidden={features?.onboarding?.[networkName]?.hidden}
                disabled={!features?.onboarding?.[networkName]?.enabled}
                onClick={() => onNetworkSelectionClick(networkName)}
            />
        {/each}
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!IS_MOBILE && 'bg-pastel-yellow dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="onboarding-network-desktop" />
    </div>
</OnboardingLayout>
