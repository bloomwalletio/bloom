<script lang="ts">
    import { TokenTransferData } from '@core/wallet'
    import { NftTile, TokenAmountTile } from '@ui'
    import { INft } from '@core/nfts'

    export let baseCoinTransfer: TokenTransferData | undefined = undefined
    export let tokenTransfer: TokenTransferData | undefined = undefined
    export let nft: INft | undefined = undefined
</script>

<asset-section class="flex flex-row gap-2 justify-between">
    {#if tokenTransfer}
        <TokenAmountTile asset={tokenTransfer.asset} amount={Number(tokenTransfer.rawAmount)} />
    {:else if nft}
        <NftTile {nft} />
    {/if}
    {#if baseCoinTransfer}
        <TokenAmountTile
            asset={baseCoinTransfer.asset}
            amount={Number(baseCoinTransfer.rawAmount)}
            hideTokenInfo={!!tokenTransfer}
        />
    {/if}
</asset-section>
