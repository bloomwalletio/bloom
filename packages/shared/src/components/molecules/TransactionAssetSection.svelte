<script lang="ts">
    import { NftTile, TokenAmountTile, AliasTile } from '@ui'
    import { INft } from '@core/nfts'
    import { getTokenFromSelectedAccountTokens } from '@core/token/stores'
    import { TokenTransferData } from '@core/wallet'

    export let baseCoinTransfer: TokenTransferData | undefined = undefined
    export let tokenTransfer: TokenTransferData | undefined = undefined
    export let nft: INft | undefined = undefined
    export let aliasId: string | undefined = undefined
    export let onNftClick: (() => void) | undefined = undefined

    $: hasBaseCoinAmount = Number(baseCoinTransfer?.rawAmount) > 0

    $: tokenWithBalance = tokenTransfer?.token
        ? getTokenFromSelectedAccountTokens(tokenTransfer.token.id, tokenTransfer.token.networkId)
        : undefined
    $: baseTokenWithBalance = baseCoinTransfer?.token
        ? getTokenFromSelectedAccountTokens(baseCoinTransfer.token.id, baseCoinTransfer.token.networkId)
        : undefined
</script>

{#if baseCoinTransfer || tokenTransfer || nft || aliasId}
    <asset-section class="w-full flex flex-row gap-2 justify-between overflow-hidden">
        {#if tokenTransfer?.token && tokenWithBalance}
            <TokenAmountTile token={tokenWithBalance} amount={Number(tokenTransfer.rawAmount)} classes="flex-grow" />
        {:else if nft}
            <NftTile {nft} fullWidth={!hasBaseCoinAmount} onClick={onNftClick} classes="flex-grow" />
        {:else if aliasId}
            <AliasTile {aliasId} fullWidth={!hasBaseCoinAmount} classes="flex-grow" />
        {/if}
        {#if baseCoinTransfer?.token && baseTokenWithBalance && Number(baseCoinTransfer?.rawAmount) > 0}
            <TokenAmountTile
                token={baseTokenWithBalance}
                amount={Number(baseCoinTransfer.rawAmount)}
                hideTokenInfo={!!tokenTransfer || !!nft}
            />
        {/if}
    </asset-section>
{/if}
