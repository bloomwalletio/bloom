<script lang="ts">
    import { activeProfile } from '@core/profile'
    import { NewTransactionType, TransactionData, selectedAccountAssets } from '@core/wallet'
    import { NftTile, TokenAmountTile } from '@ui'

    export let transactionData: TransactionData
    export let visibleSurplus: number

    $: baseCoin = $selectedAccountAssets?.[$activeProfile?.network?.id]?.baseCoin
</script>

<asset-section class="flex flex-row gap-2 justify-between">
    {#if transactionData.type === NewTransactionType.TokenTransfer}
        <TokenAmountTile asset={transactionData.asset} amount={Number(transactionData.rawAmount)} />
    {:else if transactionData.type === NewTransactionType.NftTransfer}
        <NftTile nft={transactionData.nft} />
    {/if}
    {#if visibleSurplus}
        <TokenAmountTile asset={baseCoin} amount={visibleSurplus} hideTokenInfo />
    {/if}
</asset-section>
