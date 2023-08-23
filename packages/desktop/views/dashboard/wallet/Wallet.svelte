<script lang="ts">
    import { Pane, ReceiveAddressButton, TokenList } from '@ui'
    import { AccountActivity, AccountSummary, SendButton } from '@components'
    import { getTokenFromSelectedAccountTokens, selectedAccountTokens } from '@core/token/stores'
    import { selectedAccount } from '@core/account/stores'
    import features from '@features/features'

    // TODO: Remove once done testing
    import { onMount } from 'svelte'
    import { AssetType, buildAssetAllowance } from 'shared/src/lib/core/layer-2'
    import { getActiveNetworkId } from 'shared/src/lib/core/network/actions'
    import { unwrapStardustAsset } from 'shared/src/lib/core/wallet'

    async function onMountHelper(): Promise<void> {
        if (features.wallet.assets.unwrapToken.enabled) {
            /**
             * NOTE: The amount has to be greater than or equal to the minimum required
             * storage deposit.
             */
            const storageDeposit = 47800
            const amount = (6_000_000 + storageDeposit).toString()
            const token = getTokenFromSelectedAccountTokens('4219', getActiveNetworkId())
            const allowance = buildAssetAllowance({ type: AssetType.BaseCoin, amount, token })
            const recipientAddress = $selectedAccount.depositAddress
            const receipt = await unwrapStardustAsset(allowance, recipientAddress)
            /* eslint-disable no-console */
            console.log('receipt: ', receipt)
        }
    }
    onMount(() => {
        void onMountHelper()
    })
    // TODO: Remove once done testing
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
                        <TokenList accountTokens={$selectedAccountTokens} />
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
