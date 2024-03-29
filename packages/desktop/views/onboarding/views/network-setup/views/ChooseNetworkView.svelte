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
        NetworkId,
        NetworkNamespace,
        StardustNetworkName,
        getDefaultClientOptions,
        getDefaultPersistedNetwork,
    } from '@core/network'
    import { profiles } from '@core/profile/stores'
    import features from '@features/features'
    import { OnboardingLayout } from '@views/components'
    import { onMount } from 'svelte'
    import { ButtonTile } from '../../../../components'
    import { networkSetupRouter } from '../network-setup-router'

    let selectedNetworkType: OnboardingNetworkType = features.onboarding.iota.enabled
        ? OnboardingNetworkType.Iota
        : features.onboarding.shimmer.enabled
          ? OnboardingNetworkType.Shimmer
          : features.onboarding.testnet.enabled
            ? OnboardingNetworkType.Testnet
            : OnboardingNetworkType.Custom
    function onNetworkClick(networkType: OnboardingNetworkType): void {
        if (selectedNetworkType === networkType) {
            onContinueClick()
        } else {
            selectedNetworkType = networkType
        }
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
            case OnboardingNetworkType.Iota:
                return StardustNetworkName.Iota
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
    continueButton={{
        onClick: onContinueClick,
        disabled: !selectedNetworkType,
    }}
    backButton={{
        text: localize('actions.cancel'),
        onClick: onBackClick,
        hidden: $profiles.length === 0,
    }}
>
    <div slot="content" class="flex flex-col space-y-3">
        <ButtonTile
            primaryText={localize(`views.onboarding.networkSetup.chooseNetwork.${OnboardingNetworkType.Iota}.primary`)}
            secondaryText={localize(
                `views.onboarding.networkSetup.chooseNetwork.${OnboardingNetworkType.Iota}.secondary`
            )}
            icon={IconName.Iota}
            iconSize="md"
            iconColor="#ffffff"
            backgroundColor="#000000"
            hidden={features?.onboarding?.[OnboardingNetworkType.Iota]?.hidden}
            disabled={!features?.onboarding?.[OnboardingNetworkType.Iota]?.enabled}
            onClick={() => onNetworkClick(OnboardingNetworkType.Iota)}
            selected={selectedNetworkType === OnboardingNetworkType.Iota}
        />
        <ButtonTile
            primaryText={localize(
                `views.onboarding.networkSetup.chooseNetwork.${OnboardingNetworkType.Shimmer}.primary`
            )}
            secondaryText={localize(
                `views.onboarding.networkSetup.chooseNetwork.${OnboardingNetworkType.Shimmer}.secondary`
            )}
            icon={IconName.Shimmer}
            iconSize="md"
            iconColor="blue-900"
            backgroundColor="shimmer"
            hidden={features?.onboarding?.[OnboardingNetworkType.Shimmer]?.hidden}
            disabled={!features?.onboarding?.[OnboardingNetworkType.Shimmer]?.enabled}
            onClick={() => onNetworkClick(OnboardingNetworkType.Shimmer)}
            selected={selectedNetworkType === OnboardingNetworkType.Shimmer}
        />
        <ButtonTile
            primaryText={localize(
                `views.onboarding.networkSetup.chooseNetwork.${OnboardingNetworkType.Testnet}.primary`
            )}
            secondaryText={localize(
                `views.onboarding.networkSetup.chooseNetwork.${OnboardingNetworkType.Testnet}.secondary`
            )}
            icon={IconName.Beaker}
            hidden={features?.onboarding?.[OnboardingNetworkType.Testnet]?.hidden}
            disabled={!features?.onboarding?.[OnboardingNetworkType.Testnet]?.enabled}
            onClick={() => onNetworkClick(OnboardingNetworkType.Testnet)}
            selected={selectedNetworkType === OnboardingNetworkType.Testnet}
        />
        <ButtonTile
            primaryText={localize(
                `views.onboarding.networkSetup.chooseNetwork.${OnboardingNetworkType.Custom}.primary`
            )}
            secondaryText={localize(
                `views.onboarding.networkSetup.chooseNetwork.${OnboardingNetworkType.Custom}.secondary`
            )}
            icon={IconName.SettingsSliders}
            iconColor="info"
            hidden={features?.onboarding?.[OnboardingNetworkType.Custom]?.hidden}
            disabled={!features?.onboarding?.[OnboardingNetworkType.Custom]?.enabled}
            onClick={() => onNetworkClick(OnboardingNetworkType.Custom)}
            selected={selectedNetworkType === OnboardingNetworkType.Custom}
        />
    </div>
</OnboardingLayout>
