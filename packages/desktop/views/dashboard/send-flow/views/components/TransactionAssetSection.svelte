<script lang="ts">
    import { TokenTransferData } from '@core/wallet'
    import { NftTile, TokenAmountTile } from '@ui'
    import { INft } from '@core/nfts'

    export let baseCoinTransfer: TokenTransferData | undefined = undefined
    export let tokenTransfer: TokenTransferData | undefined = undefined
    export let nft: INft | undefined = undefined

    $: hasBaseCoinAmount = Number(baseCoinTransfer?.rawAmount) > 0
</script>

<asset-section class="w-full flex flex-row gap-2 justify-between overflow-hidden">
    {#if tokenTransfer}
        <TokenAmountTile asset={tokenTransfer.asset} amount={Number(tokenTransfer.rawAmount)} classes="flex-grow" />
    {:else if nft}
        <NftTile {nft} fullWidth={!hasBaseCoinAmount} classes="flex-grow" />
    {/if}
    {#if hasBaseCoinAmount}
        <TokenAmountTile
            asset={baseCoinTransfer.asset}
            amount={Number(baseCoinTransfer.rawAmount)}
            hideTokenInfo={!!tokenTransfer || !!nft}
        />
    {/if}
</asset-section>
