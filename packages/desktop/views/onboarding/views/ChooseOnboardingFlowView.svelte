<script lang="ts">
    import { OnboardingLayout } from '@components'
    import { OnboardingType, onboardingProfile, updateOnboardingProfile } from '@contexts/onboarding'
    import { IS_MOBILE } from '@core/app'
    import { localize } from '@core/i18n'
    import { getDisplayedNameFromNetworkId, getOnboardingNetworkNameFromNetworkId } from '@core/network'
    import { profiles } from '@core/profile/stores'
    import features from '@features/features'
    import { Animation, OnboardingButton, Text, TextType } from '@ui'
    import { onMount } from 'svelte'
    import { onboardingRouter } from '../onboarding-router'

    $: networkId = $onboardingProfile?.network?.id
    $: networkName = getOnboardingNetworkNameFromNetworkId(networkId)

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
                values: {
                    network: getDisplayedNameFromNetworkId(networkId),
                },
            })}</Text
        >
    </div>
    <div slot="leftpane__content">
        <Text secondary classes="mb-8"
            >{localize('views.onboarding.profileSetup.setup.body', {
                values: {
                    network: getDisplayedNameFromNetworkId(networkId),
                },
            })}</Text
        >
    </div>
    <div slot="leftpane__action" class="flex flex-col space-y-4">
        <OnboardingButton
            primaryText={localize('actions.createWallet', {
                values: {
                    network: getDisplayedNameFromNetworkId(networkId),
                },
            })}
            secondaryText={!IS_MOBILE
                ? localize('actions.createWalletDescription', {
                      values: { network: networkName },
                  })
                : ''}
            icon="plus"
            iconHeight="11"
            iconWidth="11"
            hidden={features?.onboarding?.[networkName]?.newProfile?.hidden}
            disabled={!features?.onboarding?.[networkName]?.newProfile?.enabled}
            onClick={() => onProfileSetupSelectionClick(OnboardingType.Create)}
        />
        <OnboardingButton
            primaryText={localize(`actions.restoreWallet.${networkName}`)}
            secondaryText={!IS_MOBILE ? localize(`actions.restoreWalletDescription.${networkName}`) : ''}
            icon="transfer"
            hidden={features?.onboarding?.[networkName]?.restoreProfile?.hidden}
            disabled={!features?.onboarding?.[networkName]?.restoreProfile?.enabled}
            onClick={() => onProfileSetupSelectionClick(OnboardingType.Restore)}
        />
        <OnboardingButton
            primaryText={localize('actions.claimShimmer')}
            secondaryText={!IS_MOBILE ? localize('actions.claimShimmerDescription') : ''}
            icon="tokens"
            iconHeight="24"
            iconWidth="24"
            hidden={features?.onboarding?.[networkName]?.claimRewards?.hidden}
            disabled={!features?.onboarding?.[networkName]?.claimRewards?.enabled}
            onClick={() => onProfileSetupSelectionClick(OnboardingType.Claim)}
        />
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!IS_MOBILE && 'bg-pastel-green dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="setup-desktop" />
    </div>
</OnboardingLayout>
