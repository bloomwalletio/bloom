<script lang="ts">
    import { selectedCampaign } from '@contexts/campaigns/stores'
    import { Platform } from '@core/app'
    import features from '@features/features'
    import { CampaignsRoute, campaignsRoute } from './'
    import { CampaignDetailsView, CampaignsGalleryView } from './views'

    $: if (features.analytics.dashboardRoute.campaigns.enabled && $campaignsRoute) {
        const eventProperties = {
            route: $campaignsRoute,
            ...($campaignsRoute === CampaignsRoute.CampaignDetails && { campaignId: $selectedCampaign?.id }),
        }
        Platform.trackEvent('campaigns-route', eventProperties)
    }
</script>

<div class="w-full h-full flex flex-col flex-nowrap p-8 relative flex-1 overflow-hidden">
    {#if $campaignsRoute === CampaignsRoute.Gallery}
        <CampaignsGalleryView />
    {/if}
    {#if $campaignsRoute === CampaignsRoute.CampaignDetails}
        <CampaignDetailsView />
    {/if}
</div>
