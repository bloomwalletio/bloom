<script lang="ts">
    import { Button, IconName, Pill, Text } from '@bloomwalletio/ui'
    import { CollectiblesListMenu, EmptyListPlaceholder } from '@components'
    import { openUrlInBrowser } from '@core/app'
    import { localize } from '@core/i18n'
    import features from '@features/features'
    import { SearchInput } from '@ui'

    let searchTerm: string = ''

    interface ICampaign {
        title: string
        description: string
        image: string
    }
    const campaigns: ICampaign[] = []

    const queriedCampaigns: ICampaign[] = []

    function onBrowseCampaignsClick(): void {
        // TODO: add url to constant
        openUrlInBrowser('https://www.tideprotocol.xyz/')
    }
</script>

<campaigns-gallery-view>
    <div class="flex flex-row justify-between">
        <div class="flex flex-row text-left gap-2 items-center">
            <Text type="h6">{localize('views.campaigns.gallery.title')}</Text>
            <Pill color="neutral">
                <Text textColor="secondary">{String(campaigns.length ?? '')}</Text>
            </Pill>
        </div>
        <div class="flex items-center gap-2" style="height: 40px">
            {#if campaigns.length}
                <SearchInput bind:value={searchTerm} />
            {/if}
            {#if features.campaigns.importCampaign.enabled}
                <!-- TODO: add campaigns list menu -->
                <CollectiblesListMenu />
            {/if}
        </div>
    </div>
    {#if campaigns.length}
        {#if queriedCampaigns.length}
            <!-- <CampaignGallery nfts={queriedCampaigns} />-->
        {:else}
            <div class="w-full h-full flex flex-col items-center justify-center">
                <EmptyListPlaceholder title={localize('views.campaign.gallery.noResults')} icon={IconName.Data} />
            </div>
        {/if}
    {:else}
        <div class="w-full h-full flex flex-col items-center justify-center grow-1 gap-6">
            <EmptyListPlaceholder
                title={localize('views.campaigns.gallery.emptyTitle')}
                subtitle={localize('views.campaigns.gallery.emptyDescription')}
                icon={IconName.Data}
            />
            <Button text={localize('views.campaigns.gallery.emptyAction')} on:click={onBrowseCampaignsClick} />
        </div>
    {/if}
</campaigns-gallery-view>

<style lang="postcss">
    campaigns-gallery-view {
        @apply flex flex-col w-full h-full gap-4;
    }
</style>
