<script lang="ts">
    import { Nft } from '@core/nfts'
    import NftGalleryItem from './NftGalleryItem.svelte'

    export let nfts: Nft[] = []
</script>

<div
    class="overflow-scroll grid
    sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5
    gap-3 2xl:gap-4
    pb-6 -mb-5 pl-4 -ml-4 pr-3 -mr-5"
>
    {#each nfts as nft}
        <NftGalleryItem {nft} />
    {/each}
</div>
