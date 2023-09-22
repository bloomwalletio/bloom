<script lang="ts">
    import { Pane } from '@ui'
    import { AccountSummaryPane } from './panes'
    import { selectedAccount } from '@core/account/stores'
    import TabSection from './tab-section/TabSection.svelte'
</script>

{#if $selectedAccount}
    <wallet-container>
        {#key $selectedAccount?.index}
            <AccountSummaryPane account={$selectedAccount} />
            <Pane classes="flex flex-col flex-grow border border-solid border-gray-100 rounded-b-none">
                <TabSection />
            </Pane>
        {/key}
    </wallet-container>
{/if}

<style lang="scss">
    wallet-container {
        height: calc(100vh - var(--navbar-height) - var(--windows-navbar-height));
        @apply p-8 pb-0;
        @apply flex flex-col gap-8;
        @apply relative;
        @apply bg-white dark:bg-gray-900;
    }
</style>
