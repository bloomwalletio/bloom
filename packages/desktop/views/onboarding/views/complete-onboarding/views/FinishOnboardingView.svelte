<script lang="ts">
    import { Button, IconName, Text } from '@bloomwalletio/ui'
    import { completeOnboardingProcess, isOnboardingLedgerProfile } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import { checkOrConnectLedger } from '@core/ledger'
    import { OnboardingLayout } from '@views/components'
    import SuccessSvg from '@views/onboarding/components/SuccessSvg.svelte'
    import { onboardingRouter } from '@views/onboarding/onboarding-router'

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
        </svg-container>
        <div class="flex flex-col justify-center items-center gap-3">
            <div class="flex flex-col justify-center items-center">
                <Text type="h5" customColor="success-500">{localize(`${LOCALE_KEY}.title`)}</Text>
                <Text type="h1">{localize(`${LOCALE_KEY}.body1`)}</Text>
            </div>
            <Text type="body2" fontWeight="medium" textColor="secondary">{localize(`${LOCALE_KEY}.body2`)}</Text>
        </div>
        <Button
            on:click={onContinueClick}
            icon={IconName.ArrowNarrowRight}
            reverse
            text={localize(`${LOCALE_KEY}.action`)}
        />
    </div>
</OnboardingLayout>

<style lang="postcss">
    svg-container {
        @apply block -mt-[5.5rem];
    }
</style>
