<script lang="ts">
    import { TextInput } from '@bloomwalletio/ui'
    import { onboardingProfile, updateOnboardingProfile } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import { validateProfileName } from '@core/profile'
    import { OnboardingLayout } from '@views/components'
    import { completeOnboardingRouter } from '../complete-onboarding-router'

    let error = ''
    let profileName = $onboardingProfile?.name ?? ''

    function onContinueClick(): void {
        try {
            error = ''
            validateProfileName(profileName)
            updateOnboardingProfile({ name: profileName })
            $completeOnboardingRouter.next()
        } catch (err) {
            error = err.message
        }
    }
</script>

<OnboardingLayout
    title={localize('views.onboarding.completeOnboarding.enterName.title', {
        network: $onboardingProfile?.network?.name,
    })}
    description={localize('views.onboarding.completeOnboarding.enterName.description')}
    continueButton={{
        onClick: onContinueClick,
        disabled: !profileName,
    }}
>
    <div slot="content">
        <TextInput
            bind:error
            bind:value={profileName}
            label={localize('general.name')}
            autofocus
            on:submit={onContinueClick}
        />
    </div>
</OnboardingLayout>
