<script lang="ts">
    import { AssetList, Pane, ReceiveAddressButton } from '@ui'
    import { AccountSummary, AccountActivity, SendButton } from '@components'
    import { selectedAccountAssets } from '@core/wallet'
    import { selectedAccount } from '@core/account/stores'
    import features from '@features/features'
    import { onMount } from 'svelte'
    import { signTransactionWithLedger } from 'shared/src/lib/core/layer-2'
    import { buildBip32Path } from 'shared/src/lib/core/account'

    onMount(() => {
        const tx = {
            nonce: '0x27',
            gasPrice: '0x48',
            gasLimit: '0x10e14',
            to: '0x68194a729C2450ad26072b3D33ADaCbcef39D574',
            value: '0x0',
            data: '0xa9059cbb0000000000000000000000001bf171563b2642bb6e93081a7a1f2e6b16a54c93000000000000000000000000000000000000000000000000002386f26fc10000',
        }

        void signTransactionWithLedger(tx, buildBip32Path(60, 0))
    })
</script>

{#if $selectedAccount}
    <wallet-container
        class="w-full h-full flex flex-nowrap p-8 relative flex-1
        bg-gray-50 dark:bg-gray-900 justify-center items-center"
    >
        {#key $selectedAccount?.index}
            <div class="h-full grid grid-cols-3 gap-x-4 min-h-0 min-w-0 max-w-7xl">
                <div class="flex flex-col space-y-4">
                    <Pane overflow="visible" classes="flex-none">
                        {#if features?.wallet?.accountSummary?.enabled}
                            <AccountSummary />
                        {/if}
                    </Pane>
                    <Pane classes="flex flex-col p-6 space-y-6">
                        {#if features?.wallet?.sendAndReceive?.enabled}
                            <SendButton />
                            <ReceiveAddressButton />
                        {/if}
                    </Pane>
                </div>
                <Pane classes="h-full">
                    {#if features?.wallet?.assets?.enabled}
                        <AssetList assets={$selectedAccountAssets} />
                    {/if}
                </Pane>
                <Pane classes="h-full">
                    {#if features?.wallet?.activityHistory?.enabled}
                        <AccountActivity />
                    {/if}
                </Pane>
            </div>
        {/key}
    </wallet-container>
{/if}
