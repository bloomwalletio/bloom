<script lang="ts">
    import { NetworkTypePill, NftStandardPill } from '@ui/pills'
    import { Nft } from '@core/nfts/interfaces'

    export let nft: Nft
</script>

{#if nft}
    <div class="flex flex-row gap-2">
        <NftStandardPill {nft} />
        <NetworkTypePill networkId={nft.networkId} />
    </div>
{/if}
