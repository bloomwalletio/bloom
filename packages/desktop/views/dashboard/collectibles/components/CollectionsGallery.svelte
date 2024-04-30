<script lang="ts">
    import CollectionsGalleryItem from './CollectionsGalleryItem.svelte'
    import { Collection, Collections } from '@core/nfts'
    import VirtualList from '@sveltejs/svelte-virtual-list'
    import { breakpoint } from '@core/app/stores'

    export let collections: Collections

    $: collectionsArray = Object.entries(collections).map(([id, collection]) => {
        return { id, ...collection }
    })

    const COLLECTIONS_PER_CHUNK_FOR_SCREEN_SIZE = {
        sm: 2,
        md: 3,
        lg: 3,
        xl: 4,
        '2xl': 5,
    }

    let rowDivElement: HTMLDivElement
    $: rowDivHeight = getRowDivHeight(rowDivElement?.clientHeight)

    function getRowDivHeight(clientHeight: number | undefined) {
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

    let collectionChunks: (Collection | undefined)[][] = []
    $: collectionChunks = Array.from(
        { length: Math.ceil(collectionsArray.length / COLLECTIONS_PER_CHUNK_FOR_SCREEN_SIZE[$breakpoint]) },
        (_, i) => {
            return Array.from(
                { length: COLLECTIONS_PER_CHUNK_FOR_SCREEN_SIZE[$breakpoint] },
                (_, j) => collectionsArray[i * COLLECTIONS_PER_CHUNK_FOR_SCREEN_SIZE[$breakpoint] + j]
            )
        }
    )
</script>

<VirtualList items={collectionChunks} let:item itemHeight={rowDivHeight}>
    <div
        bind:this={rowDivElement}
        class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 2xl:gap-4 pb-3 2xl:pb-4"
    >
        {#each item as collection}
            {#if collection}
                <CollectionsGalleryItem {collection} />
            {:else}
                <div />
            {/if}
        {/each}
    </div>
</VirtualList>
