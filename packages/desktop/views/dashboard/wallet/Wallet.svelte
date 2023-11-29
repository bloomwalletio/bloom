<script lang="ts">
    import { Pane } from '@ui'
    import { selectedAccount } from '@core/account/stores'
    import { AccountSummaryPane } from './panes'
    import TabSection from './tab-section/TabSection.svelte'
    import { onMount } from 'svelte'
    import { checkForUntrackedNfts } from 'shared/src/lib/core/nfts/actions'

    onMount(() => {
        checkForUntrackedNfts($selectedAccount)
    })
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
