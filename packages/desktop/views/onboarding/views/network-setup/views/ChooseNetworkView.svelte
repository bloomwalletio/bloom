<script lang="ts">
    import { Icon } from '@auxiliary/icon'
    import { OnboardingLayout } from '@components'
    import { initialiseOnboardingProfile, updateOnboardingProfile, onboardingProfile } from '@contexts/onboarding'
    import { IS_MOBILE } from '@core/app'
    import { localize } from '@core/i18n'
    import {
        NetworkId,
        OnboardingNetworkType,
        NetworkNamespace,
        getDefaultClientOptions,
        getDefaultPersistedNetwork,
        TangleNetworkName,
    } from '@core/network'
    import { profiles } from '@core/profile/stores'
    import features from '@features/features'
    import { Animation, OnboardingButton, Text, TextType } from '@ui'
    import { onMount } from 'svelte'
    import { networkSetupRouter } from '../network-setup-router'

    let networkIcon: { [key in OnboardingNetworkType]: string }
    $: networkIcon = {
        [OnboardingNetworkType.Iota]: Icon.Iota,
        [OnboardingNetworkType.Shimmer]: Icon.Shimmer,
        [OnboardingNetworkType.Testnet]: 'settings',
        [OnboardingNetworkType.Custom]: 'settings',
    }

    $: networkIconColor = {
        [OnboardingNetworkType.Iota]: 'iota-highlight',
        [OnboardingNetworkType.Shimmer]: 'shimmer-highlight',
        [OnboardingNetworkType.Testnet]: 'blue-500',
        [OnboardingNetworkType.Custom]: 'blue-500',
    }

    function onNetworkSelectionClick(networkType: OnboardingNetworkType): void {
        if (networkType !== OnboardingNetworkType.Custom) {
            const networkName = getNetworkNameFromOnboardingNetworkName(networkType)
            const networkId: NetworkId = `${NetworkNamespace.Stardust}:${networkName}`
            const network = getDefaultPersistedNetwork(networkId)
            const clientOptions = getDefaultClientOptions(networkId)
            updateOnboardingProfile({ network, clientOptions })
        }
        $networkSetupRouter.next()
    }

    function getNetworkNameFromOnboardingNetworkName(
        networkType: OnboardingNetworkType
    ): TangleNetworkName | undefined {
        switch (networkType) {
            case OnboardingNetworkType.Iota:
                return TangleNetworkName.Iota
            case OnboardingNetworkType.Shimmer:
                return TangleNetworkName.Shimmer
            case OnboardingNetworkType.Testnet:
                return TangleNetworkName.Testnet
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

<OnboardingLayout allowBack={$profiles.length > 0} {onBackClick}>
    <div slot="title">
        <Text type={TextType.h2}>{localize('views.onboarding.networkSetup.chooseNetwork.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <Text secondary classes="mb-8">{localize('views.onboarding.networkSetup.chooseNetwork.body')}</Text>
    </div>
    <div slot="leftpane__action" class="flex flex-col space-y-4">
        {#each Object.values(OnboardingNetworkType) as networkType}
            <OnboardingButton
                primaryText={localize(`views.onboarding.networkSetup.chooseNetwork.${networkType}.title`)}
                secondaryText={!IS_MOBILE
                    ? localize(`views.onboarding.networkSetup.chooseNetwork.${networkType}.body`)
                    : ''}
                icon={networkIcon[networkType]}
                iconColor={networkIconColor[networkType]}
                hidden={features?.onboarding?.[networkType]?.hidden}
                disabled={!features?.onboarding?.[networkType]?.enabled}
                onClick={() => onNetworkSelectionClick(networkType)}
            />
        {/each}
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!IS_MOBILE && 'bg-pastel-yellow dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="onboarding-network-desktop" />
    </div>
</OnboardingLayout>
