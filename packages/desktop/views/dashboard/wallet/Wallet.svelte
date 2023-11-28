<script lang="ts">
    import { onMount } from 'svelte'
    import { Pane } from '@ui'
    import { selectedAccount } from '@core/account/stores'
    import { ETHEREUM_COIN_TYPE, EvmExplorerApi, getNetwork } from '@core/network'
    import { TokenStandard } from '@core/token'
    import { AccountSummaryPane } from './panes'
    import TabSection from './tab-section/TabSection.svelte'

    async function helper(): Promise<void> {
        try {
            const address = $selectedAccount.evmAddresses[ETHEREUM_COIN_TYPE]
            const networkId = getNetwork().getChains()[0].getConfiguration().id
            const explorerApi = new EvmExplorerApi(networkId)
            const addressAssets = await explorerApi.getAssetsForAddress(address, TokenStandard.Erc721)
            /* eslint-disable no-console */
            console.log('result: ', addressAssets)
            addressAssets.forEach(async (asset) => {
                const metadata = await explorerApi.getAssetMetadata(asset.token.address)
                /* eslint-disable no-console */
                console.log('metadata: ', metadata)
            })
        } catch (err) {
            /* eslint-disable no-console */
            console.log(err)
        }
    }

    onMount(() => {
        void helper()
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
