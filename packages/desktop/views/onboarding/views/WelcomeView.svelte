<script lang="ts">
    import { Checkbox, Link, Text } from '@bloomwalletio/ui'
    import {
        PRIVACY_POLICY_URL,
        PRIVACY_POLICY_VERSION,
        TERMS_OF_SERVICE_URL,
        TERMS_OF_SERVICE_VERSION,
    } from '@core/app/constants'
    import { hasCompletedAppSetup, lastAcceptedPrivacyPolicy, lastAcceptedTermsOfService } from '@core/app/stores'
    import { openUrlInBrowser } from '@core/app/utils'
    import { localize } from '@core/i18n'
    import { OnboardingLayout } from '@views/components'
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
    size="small"
    continueButton={{
        onClick: onContinueClick,
        disabled: !termsAccepted,
    }}
    backButton={{
        hidden: true,
    }}
>
    <div slot="content" class="flex flex-col space-y-4">
        <welcome-title class="p-1">
            <h1>
                {localize('views.onboarding.appSetup.welcome.title')}
            </h1>
            <h1 class="gradient">Bloom.</h1>
        </welcome-title>
        <Checkbox bind:checked={termsAccepted}>
            <Text slot="label">
                I've read and I accept the&nbsp
                <Link on:click={onTermsOfServiceClick}>Terms of Service</Link>
                &nbspand&nbsp
                <Link on:click={onPrivacyPolicyClick}>Privacy Policy</Link>
            </Text>
        </Checkbox>
    </div>
</OnboardingLayout>

<style>
    h1 {
        color: #3c00a6;
        font-size: 52px;
        font-style: normal;
        font-weight: 700;
        line-height: 60px; /* 134.615% */
        letter-spacing: -0.52px;
    }
    .gradient {
        background: -webkit-linear-gradient(0deg, #c4b0ff, #a82bdc, #e65426, #feb83a);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
</style>
