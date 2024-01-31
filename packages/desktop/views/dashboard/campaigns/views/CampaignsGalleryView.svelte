<script lang="ts">
    import { Button, IconName, Pill, Spinner, Text } from '@bloomwalletio/ui'
    import { CollectiblesListMenu, EmptyListPlaceholder } from '@components'
    import { ICampaign, featuredCampaigns } from '@contexts/campaigns'
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
    import { CampaignsGallery, TideLogo } from '../components'
    import { TIDE_BASE_URL } from '@core/tide'

    const tideApi = new TideApi()
    let loading = false

    const chainIds = getNetwork()
        .getChains()
        .map((chain) => Number(chain.getConfiguration().chainId))
    let campaigns: ICampaign[] = []
    $: $campaignsPerChain, (campaigns = getCampaignsForChains(chainIds))

    $: sortedCampaigns = campaigns.sort((campaignA, campaignB) => {
        const isAFeatured = featuredCampaigns.some((featuredId) => featuredId === campaignA.id)
        const isBFeatured = featuredCampaigns.some((featuredId) => featuredId === campaignB.id)
        // check if campaign is featured and sort it to the top
        if (isAFeatured && !isBFeatured) {
            return -1
        }
        if (!isAFeatured && isBFeatured) {
            return 1
        }
        return 0
    })

    let searchTerm: string = ''
    $: queriedCampaigns = sortedCampaigns.filter((campaign) => {
        return campaign.title.toLowerCase().includes(searchTerm.toLowerCase())
    })

    function onBrowseCampaignsClick(): void {
        openUrlInBrowser(TIDE_BASE_URL)
    }

    async function fetchCampaigns(): Promise<void> {
        try {
            loading = true
            const fetchCampaignsPromises = chainIds.map(async (chainId) => {
                const campaigns = (await tideApi.getCampaignsForChain(chainId)).campaigns.map((campaign) => {
                    return {
                        id: campaign.id,
                        address: campaign.address,
                        projectId: campaign.projectId,
                        title: campaign.title,
                        description: campaign.description,
                        imageUrl: campaign.imageUrl,
                        participants: campaign.participants,
                        startTime: campaign.startTime,
                        endTime: campaign.endTime,
                        url: campaign.url,
                        chainId: campaign.chain,
                        listingStatus: campaign.listingStatus,
                        ERC20Reward: campaign.ERC20Reward,
                    } as ICampaign
                })
                addCampaignForChain(chainId, campaigns)
            })
            await Promise.allSettled(fetchCampaignsPromises)
        } catch (error) {
            console.error(error)
        } finally {
            loading = false
        }
    }

    onMount(() => {
        void fetchCampaigns()
    })
</script>

<campaigns-gallery-view>
    <div class="flex flex-row justify-between items-center">
        <div class="flex flex-row text-left gap-2 items-center flex-1">
            <Text type="h6">{localize('views.campaigns.gallery.title')}</Text>
            <Pill color="neutral">
                <Text textColor="secondary">{String(campaigns.length ?? '')}</Text>
            </Pill>
        </div>
        <TideLogo class="text-primary dark:text-primary-dark" />
        <div class="flex items-center justify-end gap-2 flex-1" style="height: 40px">
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
    {:else if loading}
        <div class="w-full h-full flex flex-col items-center justify-center">
            <Spinner size="lg" textColor="primary" />
        </div>
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
