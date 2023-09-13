<script lang="ts">
    import { localize } from '@core/i18n'
    import { LedgerAppName, pollLedgerNanoStatus, stopPollingLedgerNanoStatus } from '@core/ledger'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import { Icon, Link, Text } from '@ui'
    import { OnboardingLayout } from '@views/components'
    import { onMount } from 'svelte'
    import { createFromLedgerRouter } from '../create-from-ledger-router'

    function onContinueClick(): void {
        $createFromLedgerRouter.next()
    }

    function onBackClick(): void {
        stopPollingLedgerNanoStatus()
        $createFromLedgerRouter.previous()
    }

    function onPopupOpenClick(): void {
        openPopup({
            id: PopupId.LedgerAppGuide,
        })
    }

    onMount(() => {
        pollLedgerNanoStatus()
    })
</script>

<OnboardingLayout
    title={localize('views.ledgerInstallationGuide.title', { values: { network: LedgerAppName.Shimmer } })}
    description={localize('views.ledgerInstallationGuide.body1', { values: { network: LedgerAppName.Shimmer } })}
    continueButton={{
        onClick: onContinueClick,
    }}
    backButton={{
        onClick: onBackClick,
    }}
>
    <div slot="content" class="space-y-4">
        <Text type="p" secondary classes="mb-5">{localize('views.ledgerInstallationGuide.body2')}</Text>
        <div class="flex flex-row flex-nowrap items-center justify-center space-x-4 text-center mt-28">
            <div class="flex flex-col flex-wrap space-y-2">
                <div class="bg-blue-400 rounded-2xl w-20 h-20 flex justify-center items-center">
                    <Icon icon="shimmer" width="32" height="32" classes="text-white" />
                </div>
                <Text type="p" secondary>{LedgerAppName.Shimmer}</Text>
            </div>
        </div>
        <Link icon="info" onClick={onPopupOpenClick}>
            {localize('popups.ledgerAppGuide.title', { values: { legacy: LedgerAppName.Shimmer } })}
        </Link>
    </div>
</OnboardingLayout>
