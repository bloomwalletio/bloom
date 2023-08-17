<script lang="ts">
    import { TokenTransferData } from '@core/wallet'
    import { NftTile, TokenAmountTile, AliasTile } from '@ui'
    import { INft } from '@core/nfts'

    export let baseCoinTransfer: TokenTransferData | undefined = undefined
    export let tokenTransfer: TokenTransferData | undefined = undefined
    export let nft: INft | undefined = undefined
    export let aliasId: string | undefined = undefined
    export let onNftClick: (() => void) | undefined = undefined

    $: hasBaseCoinAmount = Number(baseCoinTransfer?.rawAmount) > 0
</script>

{#if baseCoinTransfer || tokenTransfer || nft}
    <asset-section class="w-full flex flex-row gap-2 justify-between overflow-hidden">
        {#if tokenTransfer?.token}
            <TokenAmountTile token={tokenTransfer.token} amount={Number(tokenTransfer.rawAmount)} classes="flex-grow" />
        {:else if nft}
            <NftTile {nft} fullWidth={!hasBaseCoinAmount} onClick={onNftClick} classes="flex-grow" />
        {:else if aliasId}
            <AliasTile {aliasId} fullWidth={!hasBaseCoinAmount} classes="flex-grow" />
        {/if}
        {#if baseCoinTransfer?.token && Number(baseCoinTransfer?.rawAmount) > 0}
            <TokenAmountTile
                token={baseCoinTransfer.token}
                amount={Number(baseCoinTransfer.rawAmount)}
                hideTokenInfo={!!tokenTransfer || !!nft}
            />
        {/if}
    </asset-section>
{/if}
