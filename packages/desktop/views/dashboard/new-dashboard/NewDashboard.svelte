<script lang="ts">
    import { Pane } from '@ui'
    import { WalletSummaryPane } from './panes'
    import { selectedAccount } from '@core/account/stores'
    import TabSection from './tab-section/TabSection.svelte'
</script>

{#if $selectedAccount}
    <wallet-container
        class="w-full h-full flex flex-nowrap p-8 relative flex-1
        bg-white dark:bg-gray-900 justify-center items-center"
    >
        {#key $selectedAccount?.index}
            <div class="h-full w-full flex flex-col gap-8">
                <WalletSummaryPane />
                <Pane classes="flex flex-col flex-grow border border-solid border-gray-100">
                    <TabSection />
                </Pane>
            </div>
        {/key}
    </wallet-container>
{/if}
