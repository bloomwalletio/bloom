<script lang="ts">
    import { IconName } from '@bloomwalletio/ui'
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

    let selectedOnboardingType: OnboardingType | undefined = undefined
    function onOnboardingTypeClick(onboardingType: OnboardingType): void {
        if (selectedOnboardingType === onboardingType) {
            onContinueClick()
        } else {
            selectedOnboardingType = onboardingType
        }
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
    title={localize('views.onboarding.chooseOnboardingFlow.title')}
    continueButton={{
        onClick: onContinueClick,
        disabled: !selectedOnboardingType,
    }}
    backButton={{
        onClick: onBackClick,
    }}
>
    <div slot="content" class="flex flex-col space-y-3">
        <OnboardingSelectorTile
            primaryText={localize('views.onboarding.chooseOnboardingFlow.new.primary')}
            secondaryText={localize('views.onboarding.chooseOnboardingFlow.new.secondary')}
            icon={IconName.UserPlus}
            hidden={features?.onboarding?.[networkType]?.newProfile?.hidden}
            disabled={!features?.onboarding?.[networkType]?.newProfile?.enabled}
            onClick={() => onOnboardingTypeClick(OnboardingType.Create)}
            selected={selectedOnboardingType === OnboardingType.Create}
        />
        <OnboardingSelectorTile
            primaryText={localize('views.onboarding.chooseOnboardingFlow.restore.primary')}
            secondaryText={localize('views.onboarding.chooseOnboardingFlow.restore.secondary')}
            icon={IconName.Refresh2}
            iconColor="orange"
            hidden={features?.onboarding?.[networkType]?.restoreProfile?.hidden}
            disabled={!features?.onboarding?.[networkType]?.restoreProfile?.enabled}
            onClick={() => onOnboardingTypeClick(OnboardingType.Restore)}
            selected={selectedOnboardingType === OnboardingType.Restore}
        />
        <OnboardingSelectorTile
            primaryText={localize('views.onboarding.chooseOnboardingFlow.claim.primary')}
            secondaryText={localize('views.onboarding.chooseOnboardingFlow.claim.secondary')}
            icon={IconName.CoinsHand}
            iconColor="info"
            hidden={features?.onboarding?.[networkType]?.claimRewards?.hidden}
            disabled={!features?.onboarding?.[networkType]?.claimRewards?.enabled}
            onClick={() => onOnboardingTypeClick(OnboardingType.Claim)}
            selected={selectedOnboardingType === OnboardingType.Claim}
        />
    </div>
</OnboardingLayout>
