<script lang="ts">
    import { handleError } from '@core/error/handlers'
    import { getDestinationNetworkFromAddress, estimateGasForLayer1ToLayer2Transaction } from '@core/layer-2/utils'
    import { newTransactionData } from '@core/wallet/stores'
    import { onMount } from 'svelte'
    import { get } from 'svelte/store'
    import EvmTransactionDetails from './EvmTransactionDetails.svelte'
    import TransactionAssetSection from './TransactionAssetSection.svelte'
    import { EvmTransactionData } from '@core/layer-2'


    export let _onMount: (..._: any[]) => Promise<void> = async () => {}
    export let transaction: EvmTransactionData

    const { layer2Parameters } = get(newTransactionData)

    const destinationNetwork = getDestinationNetworkFromAddress(layer2Parameters?.networkAddress)
    const visibleSurplus = 0

    onMount(async () => {
        try {
            await _onMount()
        } catch (err) {
            handleError(err)
        }
    })
</script>

<div class="w-full space-y-4">
    <TransactionAssetSection {transactionData} {visibleSurplus} />
    <EvmTransactionDetails gasBudget={Number(transaction.gasLimit)} {destinationNetwork} />
</div>
