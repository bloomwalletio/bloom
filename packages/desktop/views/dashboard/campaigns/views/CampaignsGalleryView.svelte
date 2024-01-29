<script lang="ts">
    import { Button, IconName, Pill, Text } from '@bloomwalletio/ui'
    import { CollectiblesListMenu, EmptyListPlaceholder } from '@components'
    import { ICampaign } from '@contexts/campaigns'
    import {
        addCampaignForChain,
        campaignsPerChain,
        getCampaignsForChains,
    } from '@contexts/campaigns/stores/campaigns-per-chain.store'
    import { openUrlInBrowser } from '@core/app'
    import { localize } from '@core/i18n'
    import { getNetwork } from '@core/network'
    import { TideApi } from '@core/tide/apis'
    import features from '@features/features'
    import { SearchInput } from '@ui'
    import { onMount } from 'svelte'
    import { CampaignsGallery } from '../components'
    import { TIDE_BASE_URL } from '@core/tide'

    const tideApi = new TideApi()

    const chainIds = getNetwork()
        .getChains()
        .map((chain) => Number(chain.getConfiguration().chainId))
    let campaigns: ICampaign[] = []
    $: $campaignsPerChain, (campaigns = getCampaignsForChains(chainIds))

    let searchTerm: string = ''
    $: queriedCampaigns = campaigns.filter((campaign) => {
        return campaign.title.toLowerCase().includes(searchTerm.toLowerCase())
    })

    function onBrowseCampaignsClick(): void {
        openUrlInBrowser(TIDE_BASE_URL)
    }

    function fetchCampaigns(): void {
        chainIds.forEach(async (chainId) => {
            const campaigns = (await tideApi.getCampaignsForChain(chainId)).campaigns
            addCampaignForChain(chainId, campaigns)
        })
    }

    onMount(() => {
        fetchCampaigns()
    })
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
