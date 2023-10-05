<script lang="ts">
    import { Icon, IconName, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { LedgerAppName, pollLedgerDeviceState, stopPollingLedgerDeviceState } from '@core/ledger'
    import { OnboardingLayout } from '@views/components'
    import { onMount } from 'svelte'
    import { createFromLedgerRouter } from '../create-from-ledger-router'

    function onContinueClick(): void {
        $createFromLedgerRouter.next()
    }

    function onBackClick(): void {
        stopPollingLedgerDeviceState()
        $createFromLedgerRouter.previous()
    }

    onMount(() => {
        pollLedgerDeviceState()
    })
</script>

<OnboardingLayout
    title={localize('views.ledgerInstallationGuide.title')}
    description={localize('views.ledgerInstallationGuide.body', { values: { network: LedgerAppName.Shimmer } })}
    continueButton={{
        onClick: onContinueClick,
        text: localize('views.ledgerInstallationGuide.action'),
    }}
    backButton={{
        onClick: onBackClick,
    }}
>
    <content slot="content">
        <icon-container>
            <Icon name={IconName.ShimmerLedger} size="lg" customColor="neutral-1" />
        </icon-container>
        <Text customColor="neutral-4/95">{LedgerAppName.Shimmer}</Text>
    </content>
</OnboardingLayout>

<style lang="postcss">
    content {
        @apply flex flex-col justify-center items-center gap-2 py-5;
    }

    icon-container {
        @apply p-4 bg-neutral-4 rounded-[20px] w-fit scale-[1.17];
    }
</style>
