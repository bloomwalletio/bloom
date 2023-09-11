<script lang="ts">
    import { OnboardingLayout } from '@components'
    import { onboardingProfile, updateOnboardingProfile } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import { validateProfileName } from '@core/profile'
    import { profiles } from '@core/profile/stores'
    import { Input, Text } from '@ui'
    import { completeOnboardingRouter } from '../complete-onboarding-router'

    let error = ''
    let profileName = $onboardingProfile?.name ?? ''

    $: profileName, (error = '') // Error clears when profileName changes

    function onContinueClick(): void {
        try {
            validateProfileName(profileName)
            updateOnboardingProfile({ name: profileName })
            $completeOnboardingRouter.next()
        } catch (err) {
            error = err.message
        }
    }
</script>

<OnboardingLayout
    title={localize('views.onboarding.profileSetup.enterName.title', {
        network: $onboardingProfile?.network?.name,
    })}
    description={localize('views.onboarding.profileSetup.enterName.body1')}
    {onContinueClick}
    disableBack
>
    <div slot="content">
        <Text secondary classes="mb-10">
            {localize(
                `views.onboarding.profileSetup.enterName.body2.${$profiles?.length === 0 ? 'first' : 'nonFirst'}`
            )}
            {localize('views.onboarding.profileSetup.enterName.addMore')}
        </Text>
        <Input
            {error}
            bind:value={profileName}
            placeholder={localize('views.onboarding.profileSetup.enterName.profileName')}
            classes="w-full mb-6"
            autofocus
            submitHandler={onContinueClick}
        />
    </div>
</OnboardingLayout>
