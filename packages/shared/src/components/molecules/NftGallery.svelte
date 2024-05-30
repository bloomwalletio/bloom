<script lang="ts">
    import { Nft } from '@core/nfts'
    import NftGalleryItem from './NftGalleryItem.svelte'
    import VirtualList from '@sveltejs/svelte-virtual-list'
    import { breakpoint } from '@core/app/stores'

    export let nfts: Nft[] = []

    const NFTS_PER_CHUNK_FOR_SCREEN_SIZE = {
        sm: 2,
        md: 3,
        lg: 3,
        xl: 4,
        '2xl': 5,
    }

    let rowDivElement: HTMLDivElement
    $: rowDivHeight = getRowDivHeight(rowDivElement?.clientHeight)

    function getRowDivHeight(clientHeight: number | undefined): number {
        if (!clientHeight) {
            return rowDivHeight
        }

        if (!rowDivElement) {
            return clientHeight
        }

        if (Math.abs(clientHeight - rowDivHeight) > 200) {
            return rowDivHeight
        }

        return clientHeight
    }

    let nftChunks: (Nft | undefined)[][] = []
    $: nftChunks = Array.from(
        { length: Math.ceil(nfts.length / NFTS_PER_CHUNK_FOR_SCREEN_SIZE[$breakpoint]) },
        (_, i) => {
            return Array.from(
                { length: NFTS_PER_CHUNK_FOR_SCREEN_SIZE[$breakpoint] },
                (_, j) => nfts[i * NFTS_PER_CHUNK_FOR_SCREEN_SIZE[$breakpoint] + j]
            )
        }
    )
</script>

<VirtualList items={nftChunks} let:item itemHeight={rowDivHeight}>
    <div
        bind:this={rowDivElement}
        class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 2xl:gap-4 pb-3 2xl:pb-4"
    >
        {#each item as nft}
            {#if nft}
                <NftGalleryItem {nft} />
            {:else}
                <div />
            {/if}
        {/each}
    </div>
</VirtualList>
