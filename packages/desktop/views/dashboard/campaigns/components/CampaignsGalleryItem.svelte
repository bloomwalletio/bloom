<script lang="typescript">
    import { Text } from '@bloomwalletio/ui'
    import { ICampaign } from '@contexts/campaigns'
    import { setSelectedCampaign } from '@contexts/campaigns/stores'
    import { MediaPlaceholder } from '@ui'
    import { CampaignsRoute, campaignsRouter } from '../'

    export let campaign: ICampaign

    let campaignWrapperClientWidth: number

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
            <div class="min-w-full aspect-video object-cover">
                <MediaPlaceholder size="md" />
            </div>
        </div>
        <nft-name class="w-full flex flex-row items-center justify-between p-3 gap-2">
            <Text type="body2" truncate>{campaign.title}</Text>
        </nft-name>
    </container>
</button>

<style lang="scss">
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
