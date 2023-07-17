<script lang="ts">
    import { handleError } from '@core/error/handlers'
    import { getDestinationNetworkFromAddress, estimateGasForLayer1ToLayer2Transaction } from '@core/layer-2/utils'
    import { activeProfile } from '@core/profile/stores'
    import { NewTransactionType, newTransactionData, selectedAccountAssets } from '@core/wallet/stores'
    import { NftTile, TokenAmountTile } from '@ui'
    import { onMount } from 'svelte'
    import { get } from 'svelte/store'
    import EvmTransactionDetails from './EvmTransactionDetails.svelte'

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
    <div class="flex flex-row gap-2 justify-between">
        {#if transactionData.type === NewTransactionType.TokenTransfer}
            <TokenAmountTile asset={transactionData.asset} amount={Number(transactionData.rawAmount)} />
        {:else if transactionData.type === NewTransactionType.NftTransfer}
            <NftTile nft={transactionData.nft} />
        {/if}
        {#if visibleSurplus}
            <TokenAmountTile
                asset={$selectedAccountAssets?.[$activeProfile?.network?.id]?.baseCoin}
                amount={visibleSurplus}
                hideTokenInfo
            />
        {/if}
    </div>

    <EvmTransactionDetails gasBudget={estimatedGas} {destinationNetwork} />
</div>
