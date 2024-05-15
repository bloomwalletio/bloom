<script lang="ts">
    import { IconName } from '@bloomwalletio/ui'
    import {
        OnboardingNetworkType,
        initialiseOnboardingProfile,
        onboardingProfile,
        updateOnboardingProfile,
    } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import {
        NetworkNamespace,
        StardustNetworkId,
        StardustNetworkName,
        getDefaultClientOptions,
        getDefaultStardustNetwork,
    } from '@core/network'
    import features from '@features/features'
    import { OnboardingLayout } from '@views/components'
    import { onMount } from 'svelte'
    import { ButtonTile } from '../../../../components'
    import { networkSetupRouter } from '../network-setup-router'

    let selectedNetworkType: OnboardingNetworkType = OnboardingNetworkType.IotaTestnet
    function onNetworkClick(networkType: OnboardingNetworkType): void {
        if (selectedNetworkType === networkType) {
            onContinueClick()
        } else {
            selectedNetworkType = networkType
        }
    }

    function onContinueClick(): void {
        const networkName = getNetworkNameFromOnboardingNetworkType(selectedNetworkType)
        const networkId: StardustNetworkId = `${NetworkNamespace.Stardust}:${networkName}`
        const network = getDefaultStardustNetwork(networkId)
        const clientOptions = getDefaultClientOptions(networkId)
        updateOnboardingProfile({ network, clientOptions })
        $networkSetupRouter.next()
    }

    function getNetworkNameFromOnboardingNetworkType(
        networkType: OnboardingNetworkType
    ): StardustNetworkName | undefined {
        switch (networkType) {
            case OnboardingNetworkType.IotaTestnet:
                return StardustNetworkName.IotaTestnet
            case OnboardingNetworkType.Testnet:
                return StardustNetworkName.Testnet
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
    title={localize('views.onboarding.networkSetup.testnetSelection.title')}
    continueButton={{
        onClick: onContinueClick,
        disabled: !selectedNetworkType,
    }}
    backButton={{
        text: localize('actions.back'),
        onClick: onBackClick,
    }}
>
    <div slot="content" class="flex flex-col space-y-3">
        <ButtonTile
            primaryText={localize(
                `views.onboarding.networkSetup.testnetSelection.${OnboardingNetworkType.IotaTestnet}.primary`
            )}
            secondaryText={localize(
                `views.onboarding.networkSetup.testnetSelection.${OnboardingNetworkType.IotaTestnet}.secondary`
            )}
            icon={IconName.Iota}
            iconSize="md"
            iconColor="text-secondary"
            backgroundColor="iota-background"
            hidden={features?.onboarding?.[OnboardingNetworkType.IotaTestnet]?.hidden}
            disabled={!features?.onboarding?.[OnboardingNetworkType.IotaTestnet]?.enabled}
            onClick={() => onNetworkClick(OnboardingNetworkType.IotaTestnet)}
            selected={selectedNetworkType === OnboardingNetworkType.IotaTestnet}
        />
        <ButtonTile
            primaryText={localize(
                `views.onboarding.networkSetup.testnetSelection.${OnboardingNetworkType.Testnet}.primary`
            )}
            secondaryText={localize(
                `views.onboarding.networkSetup.testnetSelection.${OnboardingNetworkType.Testnet}.secondary`
            )}
            icon={IconName.Shimmer}
            iconSize="md"
            iconColor="text-secondary"
            backgroundColor="shimmer-background"
            hidden={features?.onboarding?.[OnboardingNetworkType.Testnet]?.hidden}
            disabled={!features?.onboarding?.[OnboardingNetworkType.Testnet]?.enabled}
            onClick={() => onNetworkClick(OnboardingNetworkType.Testnet)}
            selected={selectedNetworkType === OnboardingNetworkType.Testnet}
        />
    </div>
</OnboardingLayout>
