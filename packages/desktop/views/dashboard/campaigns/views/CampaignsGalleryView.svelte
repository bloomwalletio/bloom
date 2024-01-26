<script lang="ts">
    import { Button, IconName, Pill, Text } from '@bloomwalletio/ui'
    import { CollectiblesListMenu, EmptyListPlaceholder } from '@components'
    import { ICampaign } from '@contexts/campaigns'
    import { openUrlInBrowser } from '@core/app'
    import { localize } from '@core/i18n'
    import features from '@features/features'
    import { SearchInput } from '@ui'
    import { CampaignsGallery } from '../components'

    let searchTerm: string = ''

    const campaigns: ICampaign[] = [
        {
            id: '4a0207bd-1b86-412d-950c-b8116767076a',
            projectId: 1500,
            title: 'Shimmer Supporter',
            description: 'Grow the Shimmer Ecosystem and Community together with us!',
            image: 'https://tideprotocol.infura-ipfs.io/ipfs/Qma5x5QqdtuaznF8Uy2SXT8jpm9otyyEyXUdNMjxv4P6AB',
            contractAddress: '0xdac5e231C916a0B03B2de6B3D755Da71e50FA575',
        },
        {
            id: '5c8c8d19-3492-4d43-bed5-d6a77f3911b5',
            projectId: 1448,
            title: 'Road to RWA',
            description: 'Join our Road to RWA initiative!',
            image: 'https://tideprotocol.infura-ipfs.io/ipfs/QmWxfrdtqDgp8bJJ4muvEh8T84E1uxMRUAtKEmD9qxrrGX',
            contractAddress: '0xf8Da54B4DdA8bf864266D7682109136f717b3ddC',
        },
        {
            id: '7ad054cf-958a-495b-b01f-a620cf534edd',
            projectId: 1269,
            title: 'Bronze ApeDAO Supporter',
            description: 'A campaign that rewards users with unique Bronze ApeDAO Soulbound NFT and XP.',
            image: 'https://tideprotocol.infura-ipfs.io/ipfs/QmZbEuEqZtX1SBdQqC4ExGpwZF9mXyk59RkovxsQNrrQLb',
            contractAddress: '0xbCf75243604Eb9933C65A5633Ad66c06A0f0A775',
        },
    ]

    $: queriedCampaigns = campaigns.filter((campaign) => {
        return campaign.title.toLowerCase().includes(searchTerm.toLowerCase())
    })

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
            <CampaignsGallery campaigns={queriedCampaigns} />
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
