<script lang="ts">
    import { TokenTransferData } from '@core/wallet'
    import { NftTile, TokenAmountTile } from '@ui'
    import { INft } from '@core/nfts'

    export let baseCoinTransfer: TokenTransferData | undefined = undefined
    export let tokenTransfer: TokenTransferData | undefined = undefined
    export let nft: INft | undefined = undefined
    export let onNftClick: (() => void) | undefined = undefined

    $: hasBaseCoinAmount = Number(baseCoinTransfer?.rawAmount) > 0
</script>

<asset-section class="w-full flex flex-row gap-2 justify-between overflow-hidden">
    {#if tokenTransfer?.asset}
        <TokenAmountTile asset={tokenTransfer.asset} amount={Number(tokenTransfer.rawAmount)} classes="flex-grow" />
    {:else if nft}
        <NftTile {nft} fullWidth={!hasBaseCoinAmount} onClick={onNftClick} classes="flex-grow" />
    {/if}
    {#if baseCoinTransfer?.asset && Number(baseCoinTransfer?.rawAmount) > 0}
        <TokenAmountTile
            asset={baseCoinTransfer.asset}
            amount={Number(baseCoinTransfer.rawAmount)}
            hideTokenInfo={!!tokenTransfer || !!nft}
        />
    {/if}
</asset-section>
