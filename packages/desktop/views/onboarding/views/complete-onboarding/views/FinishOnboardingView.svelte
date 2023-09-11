<script lang="ts">
    import { Alert } from '@bloomwalletio/ui'
    import { OnboardingLayout } from '@components'
    import { completeOnboardingProcess, isOnboardingLedgerProfile } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import { checkOrConnectLedger } from '@core/ledger'
    import { onboardingRouter } from '@views/onboarding/onboarding-router'

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
    title={localize('views.onboarding.congratulations.title')}
    description={localize('views.onboarding.congratulations.body')}
    {onContinueClick}
    disableBack
>
    <div slot="content" class="flex flex-col space-y-6">
        {#if $isOnboardingLedgerProfile}
            <Alert variant="warning" text={localize('views.onboarding.congratulations.ledgerHint')} />
        {/if}
    </div>
</OnboardingLayout>
