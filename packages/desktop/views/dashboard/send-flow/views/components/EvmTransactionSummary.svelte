<script lang="ts">
    import { handleError } from '@core/error/handlers'
    import { getDestinationNetworkFromAddress } from '@core/layer-2/utils'
    import { NewTransactionType, newTransactionData } from '@core/wallet/stores'
    import { onMount } from 'svelte'
    import { get } from 'svelte/store'
    import EvmTransactionDetails from './EvmTransactionDetails.svelte'
    import TransactionAssetSection from './TransactionAssetSection.svelte'
    import { EvmTransactionData } from '@core/layer-2'
    import { TransactionData } from '@core/wallet'
    import { DisplayedAsset } from '../types'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}
    export let transaction: EvmTransactionData

    $: displayedAsset = getDisplayedAsset($newTransactionData)

    const { layer2Parameters } = get(newTransactionData)
    const destinationNetwork = getDestinationNetworkFromAddress(layer2Parameters?.networkAddress)
    const visibleSurplus = 0

    function getDisplayedAsset(transactionData: TransactionData): DisplayedAsset {
        if (transactionData.type === NewTransactionType.TokenTransfer) {
            return { type: 'token', asset: transactionData.asset, rawAmount: transactionData.rawAmount }
        } else {
            return { type: 'nft', nft: transactionData.nft }
        }
    }

    onMount(async () => {
        try {
            await _onMount()
        } catch (err) {
            handleError(err)
        }
    })
</script>

<div class="w-full space-y-4">
    {#if displayedAsset}
        <TransactionAssetSection {displayedAsset} {visibleSurplus} />
    {/if}

    <EvmTransactionDetails gasBudget={Number(transaction.gasLimit)} {destinationNetwork} />
</div>
