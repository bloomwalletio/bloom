<script lang="ts">
    import { Button, Checkbox, IconName, Link, Text } from '@bloomwalletio/ui'
    import {
        PRIVACY_POLICY_URL,
        PRIVACY_POLICY_VERSION,
        TERMS_OF_SERVICE_URL,
        TERMS_OF_SERVICE_VERSION,
    } from '@core/app/constants'
    import { lastAcceptedPrivacyPolicy, lastAcceptedTermsOfService } from '@core/app/stores'
    import { localize } from '@core/i18n'
    import { Illustration } from '@ui'
    import { onboardingRouter } from '../onboarding-router'
    import { LoggedOutLayout } from '@views/components'

    let termsAccepted: boolean = false
    let flash: boolean = false

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
        $onboardingRouter.next()
    }
</script>

<LoggedOutLayout gradient="spread">
    <welcome-view class="w-full h-full flex items-center justify-center py-24 px-40 gap-12 z-10">
        <div class="flex flex-col gap-8">
            <div class="flex flex-col gap-2">
                <Text type="h1">
                    {localize('views.onboarding.welcome.title')}
                    <br /><strong>Bloom Wallet</strong>
                </Text>
                <Text type="h5" textColor="secondary">
                    {localize('views.onboarding.welcome.subtitle')}
                </Text>
            </div>
            <checkbox-container class:flash>
                <Checkbox bind:checked={termsAccepted} size="lg">
                    <div slot="label" class="flex flex-col">
                        <Text type="body2" fontWeight="medium">{localize('views.onboarding.welcome.legalAction')}</Text>
                        <div class="flex">
                            <Link href={PRIVACY_POLICY_URL} text={localize('general.privacyPolicy')} textType="body2" />
                            <Text type="body2" fontWeight="medium">&nbsp&&nbsp</Text>
                            <Link
                                href={TERMS_OF_SERVICE_URL}
                                text={localize('general.termsOfService')}
                                textType="body2"
                            />
                        </div>
                    </div>
                </Checkbox>
            </checkbox-container>
            <Button
                on:click={onContinueClick}
                text={localize('views.onboarding.welcome.button')}
                icon={IconName.ArrowNarrowRight}
                reverse
                width="fit"
            />
        </div>
        <illustration-container class="relative">
            <Illustration illustration="portal" width={536} height={591} />
            <portal-glow></portal-glow>
        </illustration-container>
    </welcome-view>
</LoggedOutLayout>

<style lang="postcss">
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

    :global(checkbox-container.flash button) {
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
</style>
