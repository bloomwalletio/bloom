<script lang="ts">
    import { Nft } from '@core/nfts'
    import NftGalleryItem from './NftGalleryItem.svelte'
    import VirtualList from '@sveltejs/svelte-virtual-list'

    export let nfts: Nft[] = []

    const screenSize = 'xl'

    let nftChunks: (Nft | undefined)[][] = []
    $: nftChunks = Array.from(
        { length: Math.ceil(nfts.length / NFTS_PER_CHUNK_FOR_SCREENSIZE[screenSize]) },
        (_, i) => {
            return Array.from(
                { length: NFTS_PER_CHUNK_FOR_SCREENSIZE[screenSize] },
                (_, j) => nfts[i * NFTS_PER_CHUNK_FOR_SCREENSIZE[screenSize] + j]
            )
        }
    )

    const NFTS_PER_CHUNK_FOR_SCREENSIZE = {
        sm: 1, // 640
        md: 2, // 768
        lg: 3, // 1024
        xl: 4, // 1280
        '2xl': 5, // 1536
    }
</script>

<VirtualList items={nftChunks} let:item>
    <div class="flex gap-3 pb-3 2xl:gap-4 2xl:pb-4">
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
