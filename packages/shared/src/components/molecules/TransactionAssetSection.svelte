<script lang="ts">
    import { TokenTransferData } from '@core/wallet'
    import { NftTile, TokenAmountTile, AliasTile } from '@ui'
    import { Nft } from '@core/nfts'
    import { getTokenFromSelectedAccountTokens } from '@core/token/stores'

    export let baseCoinTransfer: TokenTransferData | undefined = undefined
    export let tokenTransfer: TokenTransferData | undefined = undefined
    export let nft: Nft | undefined = undefined
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

{#if Number(baseCoinTransfer?.rawAmount) > 0 || tokenTransfer || nft || aliasId}
    <asset-section class="w-full flex flex-row gap-2 justify-between overflow-hidden">
        {#if tokenTransfer?.token && tokenWithBalance}
            <div class="flex-grow overflow-hidden">
                <TokenAmountTile token={tokenWithBalance} amount={tokenTransfer.rawAmount} />
            </div>
        {:else if nft}
            <div class="flex-grow overflow-hidden">
                <NftTile {nft} fullWidth={!hasBaseCoinAmount} onClick={onNftClick} />
            </div>
        {:else if aliasId}
            <div class="flex-grow overflow-hidden">
                <AliasTile {aliasId} fullWidth={!hasBaseCoinAmount} />
            </div>
        {/if}
        {#if baseCoinTransfer?.token && baseTokenWithBalance && Number(baseCoinTransfer?.rawAmount) > 0}
            <TokenAmountTile
                token={baseTokenWithBalance}
                amount={baseCoinTransfer.rawAmount}
                hideTokenInfo={!!tokenTransfer || !!nft}
            />
        {/if}
    </asset-section>
{/if}
