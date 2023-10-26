<script lang="ts">
    import { OnboardingLayout } from '@views/components'
    import { localize } from '@core/i18n'
    import { LedgerAppOpen, LedgerDeviceUnlocked, LedgerLiveNotOpen, LedgerStillNotConnected } from './components'
    import { createFromLedgerRouter } from '../../create-from-ledger-router'

    let stepIndex: number = 0

    const LEDGER_CONNECTION_GUIDE_STEPS: unknown[] = [
        LedgerLiveNotOpen,
        LedgerDeviceUnlocked,
        LedgerAppOpen,
        LedgerStillNotConnected,
    ]

    function onBackClick(): void {
        if (stepIndex > 0) {
            stepIndex -= 1
        } else {
            $createFromLedgerRouter.previous()
        }
    }

    function onNextClick(): void {
        if (stepIndex < LEDGER_CONNECTION_GUIDE_STEPS.length - 1) {
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
        text: localize(`actions.${stepIndex === LEDGER_CONNECTION_GUIDE_STEPS.length - 1 ? 'close' : 'next'}`),
        onClick: onNextClick,
    }}
>
    <svelte:component this={LEDGER_CONNECTION_GUIDE_STEPS[stepIndex]} slot="content" />
</OnboardingLayout>
