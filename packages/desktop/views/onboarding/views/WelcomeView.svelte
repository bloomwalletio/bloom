<script lang="ts">
    import { Button, Checkbox, IconName, Link, Text } from '@bloomwalletio/ui'
    import {
        PRIVACY_POLICY_URL,
        PRIVACY_POLICY_VERSION,
        TERMS_OF_SERVICE_URL,
        TERMS_OF_SERVICE_VERSION,
    } from '@core/app/constants'
    import { hasCompletedAppSetup, lastAcceptedPrivacyPolicy, lastAcceptedTermsOfService } from '@core/app/stores'
    import { openUrlInBrowser } from '@core/app/utils'
    import { localize } from '@core/i18n'
    import { Illustration, Logo } from '@ui'
    import { LogoName } from '@auxiliary/logo/enums'
    import { onboardingRouter } from '../onboarding-router'

    let termsAccepted: boolean = false
    let flash: boolean = false

    function onTermsOfServiceClick(): void {
        openUrlInBrowser(TERMS_OF_SERVICE_URL)
    }

    function onPrivacyPolicyClick(): void {
        openUrlInBrowser(PRIVACY_POLICY_URL)
    }

    function onContinueClick(): void {
        if (!termsAccepted) {
            flash = true
            setTimeout(() => {
                flash = false
            }, 1500)
            return
        }
        lastAcceptedTermsOfService.set(TERMS_OF_SERVICE_VERSION)
        lastAcceptedPrivacyPolicy.set(PRIVACY_POLICY_VERSION)
        hasCompletedAppSetup.set(true)
        $onboardingRouter.next()
    }
</script>

<logo-container class="block absolute mt-8 ml-8">
    <Logo width="150" logo={LogoName.BloomLogoFull} />
</logo-container>
<welcome-view class="w-full h-full flex items-center justify-center py-24 px-40 gap-12">
    <div class="flex flex-col gap-8">
        <div class="flex flex-col gap-2">
            <Text type="h1">
                {localize('views.onboarding.appSetup.welcome.title')}
                <br /><strong>Bloom Wallet</strong>
            </Text>
            <Text type="h5" textColor="secondary">
                {localize('views.onboarding.appSetup.welcome.subtitle')}
            </Text>
        </div>
        <checkbox-container class:flash>
            <Checkbox bind:checked={termsAccepted} size="lg">
                <div slot="label" class="flex flex-col">
                    <Text type="body2" fontWeight="medium"
                        >{localize('views.onboarding.appSetup.welcome.legalBody')}</Text
                    >
                    <div class="flex">
                        <Link on:click={onPrivacyPolicyClick} text="Privacy Policy" textType="body2" />
                        <Text type="body2" fontWeight="medium">&nbsp&&nbsp</Text>
                        <Link on:click={onTermsOfServiceClick} text="Terms of Service" textType="body2" />
                    </div>
                </div>
            </Checkbox>
        </checkbox-container>
        <Button
            on:click={onContinueClick}
            text={localize('views.onboarding.appSetup.welcome.button')}
            icon={IconName.ArrowNarrowRight}
            reverse
            width="fit"
        />
    </div>
    <illustration-container class="relative">
        <Illustration illustration="portal" width="536px" height="591px" />
        <portal-glow></portal-glow>
    </illustration-container>
</welcome-view>

<bg-gradient-container>
    <bg-gradient></bg-gradient>
    <bg-gradient></bg-gradient>
    <bg-gradient></bg-gradient>
</bg-gradient-container>

<style lang="scss">
    :global(welcome-view h1 strong) {
        background: linear-gradient(86deg, #c4b0ff 3.99%, #a82bdc 24.99%, #e65426 45.83%, #feb83a 69.6%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 600;
    }

    portal-glow {
        position: absolute;
        top: 70px;
        right: 205px;
        width: 90px;
        height: 150px;
        border-top-left-radius: 999px;
        border-top-right-radius: 999px;
        filter: blur(12px);
        opacity: 0.5;
        background-color: aqua;
        animation: portal-glow 5s ease-in-out infinite;
    }

    :global(checkbox-container.flash check-box) {
        animation: flash 0.5s ease-in-out 3;
    }

    @keyframes portal-glow {
        0% {
            transform: scale(1);
            opacity: 0.1;
        }
        50% {
            transform: scale(1.1);
            opacity: 0.4;
        }
        100% {
            transform: scale(1);
            opacity: 0.1;
        }
    }

    @keyframes flash {
        0% {
            opacity: 0.6;
        }
        50% {
            opacity: 1;
        }
        100% {
            opacity: 0.6;
        }
    }

    bg-gradient-container {
        @apply absolute inset-0 flex items-center justify-center;
        @apply dark:mix-blend-color-dodge;
        @apply opacity-50 dark:opacity-20;
        @apply pointer-events-none;
        @apply blur-3xl;
    }

    bg-gradient:nth-of-type(1) {
        @apply block absolute rounded-full opacity-50;
        @apply -rotate-45;
        @apply min-w-[18.75rem] min-h-[18.75rem];
        @apply left-[-6.25rem];
        @apply mix-blend-color;
        background: conic-gradient(from 66deg at 51.51% 32.01%, #c395ff 70deg, #f4a5f6 286deg);
        rotate: 100deg;
    }

    bg-gradient:nth-of-type(2) {
        @apply block absolute rounded-full opacity-50;
        @apply min-w-[18.75rem] min-h-[18.75rem];
        @apply bottom-[-9.375rem];
        @apply mix-blend-color;
        background: conic-gradient(from 66deg at 51.51% 32.01%, #72aaff 70deg, #c395ff 178deg, #f4a5f6 286deg);
    }

    bg-gradient:nth-of-type(3) {
        @apply block absolute rounded-full opacity-50;
        @apply min-w-[18.75rem] min-h-[18.75rem];
        @apply top-[-3.125rem] right-[-3.125rem];
        @apply mix-blend-color;
        background: conic-gradient(from 66deg at 51.51% 32.01%, #72aaff 70deg, #c395ff 178deg, #f4a5f6 286deg);
    }
</style>
