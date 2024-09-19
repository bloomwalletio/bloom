<script lang="ts">
    import { Button, IconName, Text } from '@bloomwalletio/ui'
    import { Animation, Illustration } from '@ui'
    import { completeOnboardingProcess, isOnboardingLedgerProfile } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import { checkOrConnectLedger } from '@core/ledger'
    import { profiles } from '@core/profile/stores'
    import { OnboardingLayout } from '@views/components'
    import SuccessSvg from '@views/onboarding/components/SuccessSvg.svelte'
    import { onboardingRouter } from '@views/onboarding/onboarding-router'
    import LoggedOutLayout from '@views/components/LoggedOutLayout.svelte'
    import features from '@features/features'
    import { login } from '@core/profile/actions'
    import { handleError } from '@core/error/handlers'
    import { onMount } from 'svelte'

    const LOCALE_KEY = 'views.onboarding.completeOnboarding.finishOnboarding'

    let isAppSetup = false

    async function onContinueClick(): Promise<void> {
        try {
            if ($isOnboardingLedgerProfile) {
                await checkOrConnectLedger()
            }
            await completeOnboardingProcess()
            void login({ isFromOnboardingFlow: true })
            $onboardingRouter.next()
        } catch (err) {
            handleError(err)
        }
    }

    onMount(() => {
        isAppSetup = $profiles.length === 0
    })
</script>

{#if isAppSetup}
    <LoggedOutLayout hideLogo gradient="spread">
        <setup-complete>
            <SuccessSvg />
            {#if features.onboarding.confetti.enabled}
                <animation-container>
                    <Animation loop={false} animation="confetti" />
                </animation-container>
            {/if}
            <div class="flex flex-col justify-center items-center space-y-6">
                <Text type="h5" customColor="success-500">{localize(`${LOCALE_KEY}.status`)}</Text>
                <Text type="h1" align="center">{localize(`${LOCALE_KEY}.appSetup.title`)}</Text>
            </div>
            <Button
                on:click={onContinueClick}
                icon={IconName.ArrowNarrowRight}
                reverse
                text={localize(`${LOCALE_KEY}.appSetup.action`)}
            />
        </setup-complete>
        <landscape-container>
            <Illustration illustration="landscape" />
        </landscape-container>
        <balloon-container>
            <Illustration illustration="balloon" width={152} height={200} />
        </balloon-container>
    </LoggedOutLayout>
{:else}
    <OnboardingLayout
        continueButton={{
            hidden: true,
        }}
        backButton={{
            hidden: true,
        }}
    >
        <div slot="content" class="flex flex-col justify-center items-center gap-8">
            <svg-container>
                <SuccessSvg />
                {#if features.onboarding.confetti.enabled}
                    <animation-container>
                        <Animation loop={false} animation="confetti" />
                    </animation-container>
                {/if}
            </svg-container>
            <div class="flex flex-col justify-center items-center space-y-6">
                <Text type="h5" customColor="success-500">{localize(`${LOCALE_KEY}.status`)}</Text>
                <Text type="h1" align="center">{localize(`${LOCALE_KEY}.profileSetup.title`)}</Text>
            </div>
            <Button
                on:click={onContinueClick}
                icon={IconName.ArrowNarrowRight}
                reverse
                text={localize('actions.continue')}
            />
        </div>
    </OnboardingLayout>
{/if}

<style lang="postcss">
    landscape-container {
        @apply absolute bottom-0 pointer-events-none w-screen;
    }

    balloon-container {
        @apply absolute right-[14.5vw] bottom-[35vw] pointer-events-none;
        animation: floatingBalloon 5s ease-in-out infinite;
    }

    setup-complete {
        @apply mx-auto my-auto pb-64 flex flex-col justify-center items-center gap-8 z-10;
    }

    svg-container {
        @apply block -mt-[5.5rem];
    }

    animation-container {
        @apply absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-3/4 pointer-events-none;
    }

    @keyframes floatingBalloon {
        0% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-8px);
        }
        100% {
            transform: translateY(0px);
        }
    }
</style>
