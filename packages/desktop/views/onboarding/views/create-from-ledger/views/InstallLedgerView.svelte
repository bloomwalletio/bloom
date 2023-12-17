<script lang="ts">
    import { Icon, IconName, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { LedgerAppName, pollLedgerDeviceState, stopPollingLedgerDeviceState } from '@core/ledger'
    import { OnboardingLayout } from '@views/components'
    import { onMount } from 'svelte'
    import { createFromLedgerRouter } from '../create-from-ledger-router'
    import { onboardingProfile } from '@contexts/onboarding'
    import { SupportedNetworkId } from '@core/network'

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
    title={localize('views.onboarding.createFromLedger.installLedger.title')}
    description={localize('views.onboarding.createFromLedger.installLedger.description')}
    continueButton={{
        onClick: onContinueClick,
    }}
    backButton={{
        onClick: onBackClick,
    }}
>
    <content slot="content">
        {#if $onboardingProfile?.network?.id === SupportedNetworkId.Iota}
            <icon-container class="bg-black">
                <Icon name={IconName.Iota} size="lg" textColor="invert" />
            </icon-container>
            <Text>{LedgerAppName.Iota}</Text>
        {:else}
            <icon-container class="bg-neutral-4">
                <Icon name={IconName.ShimmerLedger} size="lg" customColor="neutral-1" />
            </icon-container>
            <Text customColor="neutral-4/95">{LedgerAppName.Shimmer}</Text>
        {/if}
    </content>
</OnboardingLayout>

<style lang="postcss">
    content {
        @apply flex flex-col justify-center items-center gap-2 py-5;
    }

    icon-container {
        @apply p-4 rounded-[20px] w-fit scale-[1.17];
    }
</style>
