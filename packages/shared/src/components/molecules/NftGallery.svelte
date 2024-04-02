<script lang="ts">
    import { Nft } from '@core/nfts'
    import NftGalleryItem from './NftGalleryItem.svelte'
    import VirtualList from '@sveltejs/svelte-virtual-list'

    export let nfts: Nft[] = []

    let nftChunks: (Nft | undefined)[][] = []
    $: nftChunks = Array.from({ length: Math.ceil(nfts.length / 5) }, (_, i) => {
        return Array.from({ length: 5 }, (_, j) => nfts[i * 5 + j])
    })
</script>

<VirtualList items={nftChunks} let:item>
    <div class="flex gap-3 pb-4">
        {#each item as nft}
            <div class="flex-1">
                {#if nft}
                    <NftGalleryItem {nft} />
                {:else}
                    <div />
                {/if}
            </div>
        {/each}
    </div>
</VirtualList>
