<script lang="ts">
    import { OnboardingType, onboardingProfile, updateOnboardingProfile } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import { getOnboardingNetworkTypeFromNetworkId } from '@core/network'
    import features from '@features/features'
    import { OnboardingLayout } from '@views/components'
    import { onMount } from 'svelte'
    import { OnboardingSelectorTile } from '../components'
    import { onboardingRouter } from '../onboarding-router'

    const networkId = $onboardingProfile?.network?.id
    const networkType = getOnboardingNetworkTypeFromNetworkId(networkId)
    const displayedNetworkName = $onboardingProfile?.network?.name

    let selectedOnboardingType: OnboardingType | undefined = undefined
    function onOnboardingTypeClick(onboardingType: OnboardingType): void {
        selectedOnboardingType = onboardingType
    }

    function onContinueClick(): void {
        updateOnboardingProfile({ onboardingType: selectedOnboardingType })
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

<OnboardingLayout
    title={localize('views.onboarding.profileSetup.setup.title', {
        network: displayedNetworkName,
    })}
    description={localize('views.onboarding.profileSetup.setup.body', {
        network: displayedNetworkName,
    })}
    continueButton={{
        onClick: onContinueClick,
        disabled: !selectedOnboardingType,
    }}
    backButton={{
        onClick: onBackClick,
    }}
>
    <div slot="content" class="flex flex-col space-y-4">
        <OnboardingSelectorTile
            primaryText={localize('actions.createWallet', {
                network: displayedNetworkName,
            })}
            secondaryText={localize('actions.createWalletDescription', { network: displayedNetworkName })}
            icon="plus"
            iconHeight="11"
            iconWidth="11"
            hidden={features?.onboarding?.[networkType]?.newProfile?.hidden}
            disabled={!features?.onboarding?.[networkType]?.newProfile?.enabled}
            onClick={() => onOnboardingTypeClick(OnboardingType.Create)}
            selected={selectedOnboardingType === OnboardingType.Create}
        />
        <OnboardingSelectorTile
            primaryText={localize(`actions.restoreWallet.${networkType}`)}
            secondaryText={localize(`actions.restoreWalletDescription.${networkType}`)}
            icon="transfer"
            hidden={features?.onboarding?.[networkType]?.restoreProfile?.hidden}
            disabled={!features?.onboarding?.[networkType]?.restoreProfile?.enabled}
            onClick={() => onOnboardingTypeClick(OnboardingType.Restore)}
            selected={selectedOnboardingType === OnboardingType.Restore}
        />
        <OnboardingSelectorTile
            primaryText={localize('actions.claimShimmer')}
            secondaryText={localize('actions.claimShimmerDescription')}
            icon="tokens"
            iconHeight="24"
            iconWidth="24"
            hidden={features?.onboarding?.[networkType]?.claimRewards?.hidden}
            disabled={!features?.onboarding?.[networkType]?.claimRewards?.enabled}
            onClick={() => onOnboardingTypeClick(OnboardingType.Claim)}
            selected={selectedOnboardingType === OnboardingType.Claim}
        />
    </div>
</OnboardingLayout>
