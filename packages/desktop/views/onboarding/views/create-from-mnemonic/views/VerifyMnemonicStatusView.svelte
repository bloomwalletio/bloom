<script lang="ts">
    import { Text } from '@bloomwalletio/ui'
    import { onboardingProfile } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import { OnboardingLayout } from '@views/components'
    import { createFromMnemonicRouter } from '../create-from-mnemonic-router'
    import { SuccessSvg } from '@views/onboarding/components'

    const LOCALE_KEY = 'views.onboarding.createFromMnemonic.verifyMnemonic'

    $: isVerified = $onboardingProfile?.hasVerifiedMnemonic
    $: verificationStatusLocaleKey = isVerified ? 'Success' : 'Failure'

    function onContinueClick(): void {
        $createFromMnemonicRouter.next()
    }

    function onBackClick(): void {
        $createFromMnemonicRouter.previous()
    }
</script>

<OnboardingLayout
    title={localize(`${LOCALE_KEY}${verificationStatusLocaleKey}.status`)}
    continueButton={{
        onClick: isVerified ? onContinueClick : onBackClick,
        text: isVerified ? localize('actions.continue') : localize('actions.tryAgain'),
    }}
    backButton={{
        onClick: onBackClick,
        hidden: !isVerified,
    }}
>
    <content
        slot="content"
        class="flex flex-col justify-center items-center gap-6 rounded-xl border-2 border-solid border-stroke py-6 px-4"
    >
        {#if isVerified}
            <SuccessSvg />
        {:else}
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="81" viewBox="0 0 80 81" fill="none">
                <path
                    d="M39.9993 73.8332C58.4088 73.8332 73.3327 58.9093 73.3327 40.4998C73.3327 22.0903 58.4088 7.1665 39.9993 7.1665C21.5899 7.1665 6.66602 22.0903 6.66602 40.4998C6.66602 58.9093 21.5899 73.8332 39.9993 73.8332Z"
                    fill="#FE480B"
                />
                <path
                    d="M53.3327 53.8333C53.3327 53.8333 48.3327 47.1666 39.9993 47.1666C31.666 47.1666 26.666 53.8333 26.666 53.8333"
                    fill="#FE480B"
                />
                <path
                    d="M56.666 31.3C55.3493 32.9166 53.5493 33.8333 51.666 33.8333C49.7827 33.8333 48.0327 32.9166 46.666 31.3"
                    fill="#FE480B"
                />
                <path
                    d="M33.3327 31.3C32.016 32.9166 30.216 33.8333 28.3327 33.8333C26.4493 33.8333 24.6993 32.9166 23.3327 31.3"
                    fill="#FE480B"
                />
                <path
                    d="M53.3327 53.8333C53.3327 53.8333 48.3327 47.1666 39.9993 47.1666C31.666 47.1666 26.666 53.8333 26.666 53.8333M56.666 31.3C55.3493 32.9166 53.5493 33.8333 51.666 33.8333C49.7827 33.8333 48.0327 32.9166 46.666 31.3M33.3327 31.3C32.016 32.9166 30.216 33.8333 28.3327 33.8333C26.4493 33.8333 24.6993 32.9166 23.3327 31.3M73.3327 40.4998C73.3327 58.9093 58.4088 73.8332 39.9993 73.8332C21.5899 73.8332 6.66602 58.9093 6.66602 40.4998C6.66602 22.0903 21.5899 7.1665 39.9993 7.1665C58.4088 7.1665 73.3327 22.0903 73.3327 40.4998Z"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
        {/if}
        <div class="flex flex-col justify-center items-center gap-2.5">
            <Text type="body2">
                {localize(`${LOCALE_KEY}${verificationStatusLocaleKey}.title`)}
            </Text>
            <Text type="sm" textColor="secondary" fontWeight="medium">
                {localize(`${LOCALE_KEY}${verificationStatusLocaleKey}.description`)}
            </Text>
        </div>
    </content>
</OnboardingLayout>
