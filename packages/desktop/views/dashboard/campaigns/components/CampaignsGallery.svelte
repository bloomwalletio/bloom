<script lang="ts">
    import { ICampaign } from '@contexts/campaigns'
    import CampaignsGalleryItem from './CampaignsGalleryItem.svelte'

    export let campaigns: ICampaign[] = []
</script>

<div
    class="overflow-scroll grid
    sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3
    gap-3 2xl:gap-4
    pb-6 -mb-5 pl-4 -ml-4 pr-3 -mr-5"
>
    {#each campaigns as campaign}
        <CampaignsGalleryItem {campaign} />
    {/each}
</div>
