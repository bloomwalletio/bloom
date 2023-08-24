<script lang="ts">
    import { OnboardingLayout } from '@components'
    import { OnboardingType, onboardingProfile, updateOnboardingProfile } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import { getOnboardingNetworkTypeFromNetworkId } from '@core/network'
    import { profiles } from '@core/profile/stores'
    import features from '@features/features'
    import { Animation, OnboardingButton, Text, TextType } from '@ui'
    import { onMount } from 'svelte'
    import { onboardingRouter } from '../onboarding-router'

    $: networkId = $onboardingProfile?.network?.id
    $: displayedNetworkName = $onboardingProfile?.network?.name
    $: networkType = getOnboardingNetworkTypeFromNetworkId(networkId)

    function onProfileSetupSelectionClick(onboardingType: OnboardingType): void {
        updateOnboardingProfile({ onboardingType })
        $onboardingRouter.next()
    }

    function onBackClick(): void {
        $onboardingRouter.previous()
    }

    onMount(() => {
        // Clean up if user has navigated back to this view
        updateOnboardingProfile({ onboardingType: undefined })
    })
</script>

<OnboardingLayout allowBack={$profiles.length > 0 || $onboardingProfile?.isDeveloperProfile} {onBackClick}>
    <div slot="title">
        <Text type={TextType.h2}
            >{localize('views.onboarding.profileSetup.setup.title', {
                network: displayedNetworkName,
            })}</Text
        >
    </div>
    <div slot="leftpane__content">
        <Text secondary classes="mb-8"
            >{localize('views.onboarding.profileSetup.setup.body', {
                network: displayedNetworkName,
            })}</Text
        >
    </div>
    <div slot="leftpane__action" class="flex flex-col space-y-4">
        <OnboardingButton
            primaryText={localize('actions.createWallet', {
                network: displayedNetworkName,
            })}
            secondaryText={localize('actions.createWalletDescription', { network: displayedNetworkName })}
            icon="plus"
            iconHeight="11"
            iconWidth="11"
            hidden={features?.onboarding?.[networkType]?.newProfile?.hidden}
            disabled={!features?.onboarding?.[networkType]?.newProfile?.enabled}
            onClick={() => onProfileSetupSelectionClick(OnboardingType.Create)}
        />
        <OnboardingButton
            primaryText={localize(`actions.restoreWallet.${networkType}`)}
            secondaryText={localize(`actions.restoreWalletDescription.${networkType}`)}
            icon="transfer"
            hidden={features?.onboarding?.[networkType]?.restoreProfile?.hidden}
            disabled={!features?.onboarding?.[networkType]?.restoreProfile?.enabled}
            onClick={() => onProfileSetupSelectionClick(OnboardingType.Restore)}
        />
        <OnboardingButton
            primaryText={localize('actions.claimShimmer')}
            secondaryText={localize('actions.claimShimmerDescription')}
            icon="tokens"
            iconHeight="24"
            iconWidth="24"
            hidden={features?.onboarding?.[networkType]?.claimRewards?.hidden}
            disabled={!features?.onboarding?.[networkType]?.claimRewards?.enabled}
            onClick={() => onProfileSetupSelectionClick(OnboardingType.Claim)}
        />
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-green dark:bg-gray-900">
        <Animation classes="setup-anim-aspect-ratio" animation="setup-desktop" />
    </div>
</OnboardingLayout>
