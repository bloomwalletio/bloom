<script lang="ts">
    import features from '@features/features'
    import { Pane } from '@ui'
    import { AccountSummaryPane } from './panes'
    import { selectedAccount } from '@core/account/stores'
    import TabSection from './tab-section/TabSection.svelte'
    import { Platform } from '@core/app'
    import { DashboardRoute } from '@core/router/enums'

    $: if (features.analytics.dashboardRoute.wallet.enabled) {
        Platform.trackEvent('wallet-route', DashboardRoute.Wallet)
    }
</script>

{#if $selectedAccount}
    <wallet-container>
        {#key $selectedAccount?.index}
            <AccountSummaryPane account={$selectedAccount} />
            <Pane classes="flex flex-col flex-grow rounded-b-none">
                <TabSection />
            </Pane>
        {/key}
    </wallet-container>
{/if}

<style lang="scss">
    wallet-container {
        @apply h-full;
        @apply flex flex-col gap-8;
        @apply p-8 pb-0;
        @apply relative;
    }
</style>
