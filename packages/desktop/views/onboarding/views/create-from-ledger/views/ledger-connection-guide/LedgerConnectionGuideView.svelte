<script lang="ts">
    import { OnboardingLayout } from '@views/components'
    import { localize } from '@core/i18n'
    import { LedgerAppOpen, LedgerDeviceUnlocked, LedgerLiveNotOpen, LedgerStillNotConnected } from './components'
    import { createFromLedgerRouter } from '../../create-from-ledger-router'

    let stepIndex = 0

    const LEDGER_CONNECTION_GUIDE_STEPS = [
        LedgerLiveNotOpen,
        LedgerDeviceUnlocked,
        LedgerAppOpen,
        LedgerStillNotConnected,
    ]
    const MAX_STEP_INDEX = LEDGER_CONNECTION_GUIDE_STEPS.length - 1

    function onBackClick(): void {
        if (stepIndex > 0) {
            stepIndex -= 1
        } else {
            $createFromLedgerRouter.previous()
        }
    }

    function onNextClick(): void {
        if (stepIndex < MAX_STEP_INDEX) {
            stepIndex += 1
        } else {
            $createFromLedgerRouter.next()
        }
    }
</script>

<OnboardingLayout
    title={localize('views.onboarding.createFromLedger.ledgerConnectionGuide.title')}
    backButton={{
        text: localize('actions.back'),
        onClick: onBackClick,
    }}
    continueButton={{
        text: localize(`actions.${stepIndex === MAX_STEP_INDEX ? 'close' : 'next'}`),
        onClick: onNextClick,
    }}
>
    <svelte:component this={LEDGER_CONNECTION_GUIDE_STEPS[stepIndex]} slot="content" />
</OnboardingLayout>
