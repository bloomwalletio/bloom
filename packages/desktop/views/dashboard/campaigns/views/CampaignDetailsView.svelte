<script lang="ts">
    import { Button, IconName, Link, Text } from '@bloomwalletio/ui'
    import {
        addCampaignLeaderboard,
        addUserPositionToCampaignLeaderboard,
        campaignLeaderboards,
        selectedCampaign,
    } from '@contexts/campaigns'
    import { IAccountState, getAddressFromAccountForNetwork } from '@core/account'
    import { selectedAccount } from '@core/account/stores'
    import { openUrlInBrowser } from '@core/app'
    import { handleError } from '@core/error/handlers'
    import { NetworkId, NetworkNamespace, getChainConfiguration } from '@core/network'
    import { buildNftFromPersistedErc721Nft } from '@core/nfts'
    import { updateAllAccountNftsForAccount } from '@core/nfts/actions'
    import { persistErc721Nft } from '@core/nfts/actions/persistErc721Nft'
    import { ownedNfts } from '@core/nfts/stores'
    import { TIDE_BASE_URL, TideWebsiteEndpoint } from '@core/tide'
    import { TideApi } from '@core/tide/apis'
    import Pane from '@ui/atoms/Pane.svelte'
    import { MediaPlaceholder } from '@ui/molecules'
    import { onMount } from 'svelte'
    import CampaignParticipantsPill from '../components/CampaignParticipantsPill.svelte'
    import CampaignRewardsPill from '../components/CampaignRewardsPill.svelte'
    import CampaignStatusPill from '../components/CampaignStatusPill.svelte'
    import CampaignTimestampPill from '../components/CampaignTimestampPill.svelte'
    import Leaderboard from '../components/Leaderboard.svelte'
    import UserPositionCard from '../components/UserPositionCard.svelte'

    const tideApi = new TideApi()
    let imageLoadError = false
    let leaderboardLoading = false
    let leaderboardError = false
    let userAddress: string

    $: chainConfiguration = getChainConfiguration(`${NetworkNamespace.Evm}:${$selectedCampaign.chainId}` as NetworkId)
    $: ({ board: leaderboard, userPosition } = $campaignLeaderboards[$selectedCampaign.projectId]?.[
        $selectedCampaign.id
    ] ?? { board: undefined, userPosition: undefined })
    $: fetchAndPersistUserData($selectedAccount, chainConfiguration?.id)
    $: userNft = $ownedNfts.find((nft) => nft.id?.startsWith($selectedCampaign.address.toLowerCase()))

    function fetchAndPersistUserData(account: IAccountState, networkId: NetworkId): void {
        if (networkId) {
            userAddress = getAddressFromAccountForNetwork(account, networkId)?.toLowerCase()
            void fetchAndPersistUserPosition(userAddress)
            void fetchAndPersistUserNft(userAddress, account.index)
        }
    }

    async function fetchAndPersistUserPosition(address: string): Promise<void> {
        const leaderboardResponse = await tideApi.getProjectLeaderboard($selectedCampaign.projectId, {
            cids: [$selectedCampaign.id],
            by: 'ADDRESS',
            search: address,
        })
        addUserPositionToCampaignLeaderboard(
            $selectedCampaign.projectId,
            $selectedCampaign.id,
            leaderboardResponse.filteredLeaderboard?.[0]
        )
    }

    async function fetchAndPersistUserNft(accountAddress: string, index: number): Promise<void> {
        if (userNft) {
            return
        }

        const { tokenId } = await tideApi.getNftUserData(
            $selectedCampaign.chainId,
            accountAddress,
            $selectedCampaign.address
        )
        if (!tokenId) {
            return
        }

        try {
            const persistedNft = await persistErc721Nft($selectedCampaign.address, tokenId, chainConfiguration.id)
            if (persistedNft) {
                const nft = buildNftFromPersistedErc721Nft(persistedNft, accountAddress)
                updateAllAccountNftsForAccount(index, nft)
            }
        } catch (_) {
            // Switching account too swiftly results in an error from persistErc721Nft.
        }
    }

    onMount(async () => {
        if (!leaderboard) {
            await fetchAndPersistLeaderboard()
        }
    })

    async function fetchAndPersistLeaderboard(): Promise<void> {
        try {
            leaderboardLoading = true
            const leaderboardResponse = await tideApi.getProjectLeaderboard($selectedCampaign.projectId, {
                cids: [$selectedCampaign.id],
            })
            addCampaignLeaderboard(
                $selectedCampaign.projectId,
                $selectedCampaign.id,
                leaderboardResponse.filteredLeaderboard
            )
            leaderboardLoading = false
        } catch (error) {
            handleError(error)
            leaderboardError = true
            leaderboardLoading = false
        }
    }

    function onProjectClick(): void {
        openUrlInBrowser(`${TIDE_BASE_URL}/${TideWebsiteEndpoint.Project}/${$selectedCampaign.projectId}`)
    }

    function onCampaignClick(): void {
        openUrlInBrowser(`${TIDE_BASE_URL}/${TideWebsiteEndpoint.Campaign}/${$selectedCampaign.id}`)
    }
</script>

<div class="h-full flex flex-col gap-6 pb-6 -mb-5">
    <Pane
        classes="
            w-full shrink-0 grid grid-cols-3 h-1/4
            bg-surface dark:bg-surface-dark 
            border border-solid border-stroke dark:border-stroke-dark 
            divide-x divide-solid divide-stroke dark:divide-stroke-dark 
            shadow-lg
        "
    >
        {#if $selectedCampaign.imageUrl && !imageLoadError}
            <div class="p-4">
                <img
                    src={$selectedCampaign.imageUrl}
                    alt={$selectedCampaign?.title}
                    class="w-full h-full object-cover rounded-lg"
                    on:error={() => (imageLoadError = true)}
                />
            </div>
        {:else}
            <div class="min-w-full h-full object-cover">
                <MediaPlaceholder size="md" />
            </div>
        {/if}
        <div class="col-span-2 flex flex-col items-start divide-y divide-solid divide-stroke dark:divide-stroke-dark">
            <div class="w-full flex flex-row justify-between items-center py-4 px-5">
                <Text type="body1" classes="whitespace-nowrap">{$selectedCampaign.title}</Text>
                <div class="flex flex-row gap-3">
                    <Button
                        size="xs"
                        icon={IconName.Send}
                        variant="outlined"
                        on:click={onProjectClick}
                        text="Project Page"
                    />
                    <Button size="xs" icon={IconName.Send} on:click={onCampaignClick} text="Campaign" />
                </div>
            </div>
            <div class="h-full w-full flex flex-col items-start justify-between p-5 gap-4">
                <Text type="base" textColor="secondary">{$selectedCampaign.description}</Text>
                <div class="w-full flex flex-row justify-between gap-4">
                    <div class="flex flex-row gap-2">
                        <CampaignStatusPill campaign={$selectedCampaign} />
                        <CampaignTimestampPill campaign={$selectedCampaign} />
                        <CampaignParticipantsPill campaign={$selectedCampaign} />
                        <CampaignRewardsPill campaign={$selectedCampaign} />
                    </div>
                    <Link
                        text={$selectedCampaign.url}
                        external
                        on:click={() => openUrlInBrowser($selectedCampaign.url)}
                    />
                </div>
            </div>
        </div>
    </Pane>

    <div class="flex-grow grid grid-cols-7 gap-5 items-start shrink-0 h-3/4">
        <div class="h-full col-span-5">
            <Leaderboard
                leaderboardItems={leaderboard}
                {userAddress}
                networkId={chainConfiguration?.id}
                loading={leaderboardLoading}
                error={leaderboardError}
            />
        </div>
        <div class="h-full flex flex-col flex-grow gap-8 col-span-2">
            <UserPositionCard {userPosition} nft={userNft} />
        </div>
    </div>
</div>
