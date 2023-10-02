<script lang="ts">
    import { selectedAccountIndex } from '@core/account/stores'
    import { collectiblesRoute, CollectiblesRoute, collectiblesRouter } from '@core/router'
    import { CollectiblesDetailsView, CollectiblesGalleryView } from './views'

    $: $selectedAccountIndex !== undefined && $collectiblesRouter.reset()
</script>

<div class="w-full h-full flex flex-col flex-nowrap p-8 relative flex-1 bg-surface dark:bg-surface-dark">
    {#if $collectiblesRoute === CollectiblesRoute.Gallery}
        <CollectiblesGalleryView />
    {/if}
    {#if $collectiblesRoute === CollectiblesRoute.Details}
        <CollectiblesDetailsView />
    {/if}
</div>
