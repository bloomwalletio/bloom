<script lang="ts">
    import { Platform } from '@core/app'
    import features from '@features/features'
    import { selectedAccountIndex } from '@core/account/stores'
    import { collectiblesRoute, CollectiblesRoute, collectiblesRouter } from '@core/router'
    import { CollectiblesDetailsView, CollectiblesGalleryView, CollectionsGalleryView } from './views'

    $: $selectedAccountIndex !== undefined && $collectiblesRouter.reset()

    $: if (features.analytics.dashboardRoute.collectibles.enabled && $collectiblesRoute) {
        Platform.trackEvent('collectibles-route', { route: $collectiblesRoute })
    }
</script>

<div class="w-full h-full flex flex-col flex-nowrap p-8 relative flex-1">
    {#if $collectiblesRoute === CollectiblesRoute.Gallery}
        <CollectiblesGalleryView />
    {/if}
    {#if $collectiblesRoute === CollectiblesRoute.Details}
        <CollectiblesDetailsView />
    {/if}
    {#if features.collectibles.collections.enabled}
        {#if $collectiblesRoute === CollectiblesRoute.CollectionsGallery}
            <CollectionsGalleryView />
        {/if}
    {/if}
</div>
