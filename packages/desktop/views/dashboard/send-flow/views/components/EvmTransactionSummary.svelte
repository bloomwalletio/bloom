<script lang="ts">
    import { getDestinationNetworkFromAddress } from '@core/layer-2/utils'
    import { NewTransactionType } from '@core/wallet/stores'
    import EvmTransactionDetails from './EvmTransactionDetails.svelte'
    import TransactionAssetSection from './TransactionAssetSection.svelte'
    import { EvmTransactionData } from '@core/layer-2'
    import { TransactionData } from '@core/wallet'
    import { DisplayedAsset } from '../types'

    export let transaction: EvmTransactionData
    export let transactionData: TransactionData

    $: displayedAsset = getDisplayedAsset(transactionData)
    $: destinationNetwork = getDestinationNetworkFromAddress(transactionData?.layer2Parameters?.networkAddress)

    function getDisplayedAsset(transactionData: TransactionData): DisplayedAsset {
        if (transactionData.type === NewTransactionType.TokenTransfer) {
            return { type: 'token', asset: transactionData.asset, rawAmount: transactionData.rawAmount }
        } else {
            return { type: 'nft', nft: transactionData.nft }
        }
    }
</script>

<div class="w-full space-y-4">
    {#if displayedAsset}
        <TransactionAssetSection {displayedAsset} />
    {/if}
    <EvmTransactionDetails gasBudget={Number(transaction.gasLimit)} {destinationNetwork} />
</div>
