<script lang="ts">
    import { Button, IconName, Text } from '@bloomwalletio/ui'
    import { Illustration } from '@ui'
    import { completeOnboardingProcess, isOnboardingLedgerProfile } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import { checkOrConnectLedger } from '@core/ledger'
    import { profiles } from '@core/profile/stores'
    import { OnboardingLayout } from '@views/components'
    import SuccessSvg from '@views/onboarding/components/SuccessSvg.svelte'
    import { onboardingRouter } from '@views/onboarding/onboarding-router'
    import LoggedOutLayout from '@views/components/LoggedOutLayout.svelte'

    const LOCALE_KEY = 'views.onboarding.congratulations'

    function onContinueClick(): void {
        if ($isOnboardingLedgerProfile) {
            checkOrConnectLedger(_continue)
        } else {
            void _continue()
        }
    }

    function _continue(): Promise<void> {
        completeOnboardingProcess()
        $onboardingRouter.next()
        return Promise.resolve()
    }
</script>

{#if $profiles.length === 0}
    <LoggedOutLayout hideLogo>
        <setup-complete>
            <SuccessSvg />
            <div class="flex flex-col justify-center items-center gap-3">
                <div class="flex flex-col justify-center items-center">
                    <Text type="h5" customColor="success-500">{localize(`${LOCALE_KEY}.title`)}</Text>
                    <Text type="h1">{localize(`${LOCALE_KEY}.body1`)}</Text>
                </div>
                <Text type="body2" fontWeight="medium" textColor="secondary">{localize(`${LOCALE_KEY}.body3`)}</Text>
            </div>
            <Button
                on:click={onContinueClick}
                icon={IconName.ArrowNarrowRight}
                reverse
                text={localize(`${LOCALE_KEY}.action`)}
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
        size="fit"
    >
        <div slot="content" class="flex flex-col justify-center items-center gap-8">
            <svg-container>
                <SuccessSvg />
            </svg-container>
            <div class="flex flex-col justify-center items-center gap-3">
                <div class="flex flex-col justify-center items-center">
                    <Text type="h5" customColor="success-500">{localize(`${LOCALE_KEY}.title`)}</Text>
                    <Text type="h1">{localize(`${LOCALE_KEY}.body2`)}</Text>
                </div>
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
