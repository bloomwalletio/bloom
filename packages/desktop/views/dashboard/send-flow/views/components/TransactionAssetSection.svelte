<script lang="ts">
    import { activeProfile } from '@core/profile'
    import { selectedAccountAssets } from '@core/wallet'
    import { NftTile, TokenAmountTile } from '@ui'
    import { DisplayedAsset } from '../types'

    export let displayedAsset: DisplayedAsset
    export let visibleSurplus: number

    $: baseCoin = $selectedAccountAssets?.[$activeProfile?.network?.id]?.baseCoin
</script>

<asset-section class="flex flex-row gap-2 justify-between">
    {#if displayedAsset.type === 'token'}
        <TokenAmountTile asset={displayedAsset.asset} amount={Number(displayedAsset.rawAmount)} />
    {:else}
        <NftTile nft={displayedAsset.nft} />
    {/if}
    {#if visibleSurplus}
        <TokenAmountTile asset={baseCoin} amount={visibleSurplus} hideTokenInfo />
    {/if}
</asset-section>
