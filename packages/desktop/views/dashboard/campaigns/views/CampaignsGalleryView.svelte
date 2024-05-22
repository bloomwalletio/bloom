<script lang="ts">
    import { Button, IconName, Pill, Spinner, Text } from '@bloomwalletio/ui'
    import { CollectiblesListMenu, EmptyListPlaceholder } from '@components'
    import { CAMPAIGN_END_DATE_CUT_OFF, ICampaign, featuredCampaigns } from '@contexts/campaigns'
    import {
        addCampaignForChain,
        campaignsPerChain,
        getCampaignsForChains,
    } from '@contexts/campaigns/stores/campaigns-per-chain.store'
    import { openUrlInBrowser } from '@core/app'
    import { localize } from '@core/i18n'
    import { getEvmNetworks } from '@core/network'
    import { TideApi } from '@core/tide/apis'
    import features from '@features/features'
    import { SearchInput } from '@ui'
    import { onMount } from 'svelte'
    import { TIDE_BASE_URL, TideListingStatus } from '@core/tide'
    import { CampaignsGallery, TideLogo } from '../components'

    const tideApi = new TideApi()
    let loading = false

    const chainIds = getEvmNetworks().map((evmNetwork) => Number(evmNetwork.chainId))
    let campaigns: ICampaign[] = []
    $: $campaignsPerChain, (campaigns = getCampaignsForChains(chainIds))

    $: sortedCampaigns = campaigns
        .filter((campaign) => {
            // filter out campaigns that are not listed or have ended
            return (
                campaign.listingStatus === TideListingStatus.Listed &&
                new Date(campaign.endTime) > new Date(CAMPAIGN_END_DATE_CUT_OFF)
            )
        })
        .sort((campaignA, campaignB) => {
            // show active before ended
            const hasAEnded = new Date(campaignA.endTime) < new Date()
            const hasBEnded = new Date(campaignB.endTime) < new Date()
            if (hasAEnded && !hasBEnded) {
                return 1
            } else if (!hasAEnded && hasBEnded) {
                return -1
            }

            // then featured before non-featured
            const isAFeatured = featuredCampaigns.some((featuredId) => featuredId === campaignA.id)
            const isBFeatured = featuredCampaigns.some((featuredId) => featuredId === campaignB.id)
            if (isAFeatured && !isBFeatured) {
                return -1
            } else if (!isAFeatured && isBFeatured) {
                return 1
            } else {
                // then sort by end date
                return new Date(campaignA.endTime) > new Date(campaignB.endTime) ? 1 : -1
            }
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
                <Text textColor="secondary">{String(sortedCampaigns.length ?? '')}</Text>
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
