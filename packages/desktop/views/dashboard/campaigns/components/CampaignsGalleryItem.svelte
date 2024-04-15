<script lang="typescript">
    import { Text } from '@bloomwalletio/ui'
    import { ICampaign, featuredCampaigns } from '@contexts/campaigns'
    import { setSelectedCampaign } from '@contexts/campaigns/stores'
    import { MediaPlaceholder } from '@ui'
    import { CampaignsRoute, campaignsRouter } from '../'
    import CampaignParticipantsPill from './CampaignParticipantsPill.svelte'
    import CampaignStatusPill from './CampaignStatusPill.svelte'
    import CampaignTimestampPill from './CampaignTimestampPill.svelte'
    import FeaturedPill from './FeaturedPill.svelte'
    import CampaignRewardsPill from './CampaignRewardsPill.svelte'

    export let campaign: ICampaign

    $: featured = featuredCampaigns.some((featuredId) => featuredId === campaign.id)

    let campaignWrapperClientWidth: number
    let imageLoadError = false

    function onCampaignClick(): void {
        setSelectedCampaign(campaign)
        $campaignsRouter.setBreadcrumb(campaign.title)
        $campaignsRouter.goTo(CampaignsRoute.CampaignDetails)
    }
</script>

<button type="button" on:click={onCampaignClick} class="campaign-gallery-item">
    <container>
        <div
            class="w-full flex relative bg-surface-2 dark:bg-surface-2-dark"
            bind:clientWidth={campaignWrapperClientWidth}
            style="height: {(campaignWrapperClientWidth * 9) / 16}px; "
        >
            {#if featured}
                <div class="absolute top-0 flex w-full p-4">
                    <FeaturedPill />
                </div>
            {/if}
            {#if campaign.imageUrl && !imageLoadError}
                <img
                    src={campaign.imageUrl}
                    alt={campaign?.title}
                    class="h-full object-cover"
                    on:error={() => (imageLoadError = true)}
                />
            {:else}
                <div class="min-w-full h-full object-cover">
                    <MediaPlaceholder size="md" />
                </div>
            {/if}
        </div>
        <div class="w-full flex flex-col items-start p-3 gap-2">
            <Text type="body2" truncate>{campaign.title}</Text>
            <div class="flex flex-row gap-2">
                <CampaignStatusPill {campaign} />
                <CampaignTimestampPill {campaign} />
                <CampaignParticipantsPill {campaign} />
                <CampaignRewardsPill {campaign} />
            </div>
        </div>
    </container>
</button>

<style lang="postcss">
    .campaign-gallery-item {
        container {
            @apply w-full overflow-hidden flex flex-col divide-y divide-solid divide-stroke dark:divide-stroke-dark;
            @apply border border-solid border-stroke dark:border-stroke-dark;
            @apply bg-surface-1 dark:bg-surface-1-dark;
            @apply rounded-2xl;
            @apply duration-300;
            transition-property: background-color, border-color, box-shadow;
        }

        &:hover,
        &:focus {
            container {
                @apply shadow-lg dark:shadow-violet-900/25;
                @apply border-2 border-brand-500;
                @apply bg-surface dark:bg-surface-dark;
            }
        }
    }
</style>
