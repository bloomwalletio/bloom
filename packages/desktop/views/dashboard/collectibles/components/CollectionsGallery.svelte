<script lang="ts">
    import CollectionsGalleryItem from './CollectionsGalleryItem.svelte'
    import VirtualList from '@sveltejs/svelte-virtual-list'
    import { breakpoint } from '@core/app/stores'

    export let collectionsIds: string[]

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

    let collectionChunks: (string | undefined)[][] = []
    $: collectionChunks = Array.from(
        { length: Math.ceil(collectionsIds.length / COLLECTIONS_PER_CHUNK_FOR_SCREEN_SIZE[$breakpoint]) },
        (_, i) => {
            return Array.from(
                { length: COLLECTIONS_PER_CHUNK_FOR_SCREEN_SIZE[$breakpoint] },
                (_, j) => collectionsIds[i * COLLECTIONS_PER_CHUNK_FOR_SCREEN_SIZE[$breakpoint] + j]
            )
        }
    )
</script>

<VirtualList items={collectionChunks} let:item itemHeight={rowDivHeight}>
    <div
        bind:this={rowDivElement}
        class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 2xl:gap-4 pb-3 2xl:pb-4"
    >
        {#each item as collectionId}
            {#if collectionId}
                <CollectionsGalleryItem {collectionId} />
            {:else}
                <div />
            {/if}
        {/each}
    </div>
</VirtualList>
