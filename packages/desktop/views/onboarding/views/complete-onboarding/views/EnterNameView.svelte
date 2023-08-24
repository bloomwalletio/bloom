<script lang="ts">
    import { OnboardingLayout } from '@components'
    import { onboardingProfile, updateOnboardingProfile } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import { validateProfileName } from '@core/profile'
    import { profiles } from '@core/profile/stores'
    import { Animation, Button, Input, Text, TextType } from '@ui'
    import { completeOnboardingRouter } from '../complete-onboarding-router'

    let error = ''
    let profileName = $onboardingProfile?.name ?? ''

    $: isProfileNameValid = profileName && profileName.trim()
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

<OnboardingLayout allowBack={false}>
    <div slot="title">
        <Text type={TextType.h2}
            >{localize('views.onboarding.profileSetup.enterName.title', {
                network: $onboardingProfile?.network?.name,
            })}</Text
        >
    </div>
    <div slot="leftpane__content">
        <Text secondary classes="mb-4">{localize('views.onboarding.profileSetup.enterName.body1')}</Text>
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
    <div slot="leftpane__action" class="flex flex-col">
        <Button classes="w-full" disabled={!isProfileNameValid} onClick={onContinueClick}>
            {localize('actions.continue')}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-green dark:bg-gray-900">
        <Animation classes="setup-anim-aspect-ratio" animation="profile-desktop" />
    </div>
</OnboardingLayout>
