<script lang="ts">
    import { Pane } from '@ui'
    import { selectedAccount } from '@core/account/stores'
    import { AccountSummaryPane } from './panes'
    import TabSection from './tab-section/TabSection.svelte'
</script>

{#if $selectedAccount}
    <wallet-container class="relative h-full flex flex-col gap-8 p-8 pb-0">
        {#key $selectedAccount?.index}
            <AccountSummaryPane account={$selectedAccount} />
            <Pane classes="flex flex-col flex-grow rounded-b-none">
                <TabSection />
            </Pane>
        {/key}
    </wallet-container>
{/if}
