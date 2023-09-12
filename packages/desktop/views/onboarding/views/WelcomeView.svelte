<script lang="ts">
    import { OnboardingLayout } from '@components'
    import {
        PRIVACY_POLICY_URL,
        PRIVACY_POLICY_VERSION,
        TERMS_OF_SERVICE_URL,
        TERMS_OF_SERVICE_VERSION,
    } from '@core/app/constants'
    import { hasCompletedAppSetup, lastAcceptedPrivacyPolicy, lastAcceptedTermsOfService } from '@core/app/stores'
    import { openUrlInBrowser } from '@core/app/utils'
    import { localize } from '@core/i18n'
    import { Checkbox, Link, Text, TextType } from '@ui'
    import { onboardingRouter } from '../onboarding-router'

    let termsAccepted: boolean = false

    function onTermsOfServiceClick(): void {
        openUrlInBrowser(TERMS_OF_SERVICE_URL)
    }

    function onPrivacyPolicyClick(): void {
        openUrlInBrowser(PRIVACY_POLICY_URL)
    }

    function onContinueClick(): void {
        lastAcceptedTermsOfService.set(TERMS_OF_SERVICE_VERSION)
        lastAcceptedPrivacyPolicy.set(PRIVACY_POLICY_VERSION)
        hasCompletedAppSetup.set(true)
        $onboardingRouter.next()
    }
</script>

<OnboardingLayout
    title={localize('views.onboarding.appSetup.welcome.title', {
        network: '',
    })}
    description={localize('views.onboarding.appSetup.welcome.description')}
    continueButton={{
        onClick: onContinueClick,
        disabled: !termsAccepted,
    }}
    backButton={{
        hidden: true,
    }}
>
    <div slot="content" class="flex flex-col space-y-8">
        <Checkbox bind:checked={termsAccepted}>
            <Text slot="label" type={TextType.p} secondary>
                I've read and I accept the <Link onClick={onTermsOfServiceClick}>Terms of Service</Link> and <Link
                    onClick={onPrivacyPolicyClick}>Privacy Policy</Link
                >
            </Text>
        </Checkbox>
    </div>
</OnboardingLayout>
