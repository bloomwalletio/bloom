<script lang="ts">
    import { Pane } from '@ui'
    import { WalletSummaryPane } from './panes'
    import { selectedAccount } from '@core/account/stores'
</script>

{#if $selectedAccount}
    <wallet-container
        class="w-full h-full flex flex-nowrap p-8 relative flex-1
        bg-gray-50 dark:bg-gray-900 justify-center items-center"
    >
        {#key $selectedAccount?.index}
            <div class="h-full w-full flex flex-col gap-8">
                <div class="h-1/4">
                    <WalletSummaryPane />
                </div>
                <Pane classes="flex-grow">Activity/Token section</Pane>
            </div>
        {/key}
    </wallet-container>
{/if}
