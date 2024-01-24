<script lang="ts">
    import { Platform } from '@core/app'
    import features from '@features/features'
    import { CampaignDetailsView, CampaignsGalleryView } from './views'
    import { campaignsRoute, CampaignsRoute } from './'

    $: if (features.analytics.dashboardRoute.campaigns.enabled && $campaignsRoute) {
        Platform.trackEvent('campaigns-route', { route: $campaignsRoute })
    }
</script>

<div class="w-full h-full flex flex-col flex-nowrap p-8 relative flex-1">
    {#if $campaignsRoute === CampaignsRoute.Gallery}
        <CampaignsGalleryView />
    {/if}
    {#if $campaignsRoute === CampaignsRoute.CampaignDetails}
        <CampaignDetailsView />
    {/if}
</div>
