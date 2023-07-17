<script lang="ts">
    import { handleError } from '@core/error/handlers'
    import { getDestinationNetworkFromAddress, estimateGasForLayer1ToLayer2Transaction } from '@core/layer-2/utils'
    import { newTransactionData } from '@core/wallet/stores'
    import { onMount } from 'svelte'
    import { get } from 'svelte/store'
    import EvmTransactionDetails from './EvmTransactionDetails.svelte'
    import TransactionAssetSection from './TransactionAssetSection.svelte'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    const { layer2Parameters } = get(newTransactionData)

    const destinationNetwork = getDestinationNetworkFromAddress(layer2Parameters?.networkAddress)
    const visibleSurplus = 0
    let estimatedGas = 0

    $: transactionData = get(newTransactionData)
    $: transactionData, void setEstimatedGas()

    async function setEstimatedGas(): Promise<void> {
        estimatedGas = await estimateGasForLayer1ToLayer2Transaction(transactionData)
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
    <TransactionAssetSection {transactionData} {visibleSurplus} />

    <EvmTransactionDetails gasBudget={estimatedGas} {destinationNetwork} />
</div>
