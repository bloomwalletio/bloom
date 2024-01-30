<script lang="ts">
    import { Button, IconName, Text } from '@bloomwalletio/ui'
    import { getNetwork } from '@core/network'
    import { TideApi } from '@core/tide/apis'
    import Pane from '@ui/atoms/Pane.svelte'
    import { MediaPlaceholder } from '@ui/molecules'
    import { onMount } from 'svelte'
    import Leaderboard from '../components/Leaderboard.svelte'
    import {
        campaignLeaderboards,
        addCampaignLeaderboard,
        selectedCampaign,
        addUserPositionToCampaignLeaderboard,
    } from '@contexts/campaigns'
    import UserPositionCard from '../components/UserPositionCard.svelte'
    import { selectedAccount } from '@core/account/stores'
    import { IAccountState, getAddressFromAccountForNetwork } from '@core/account'
    import { ownedNfts } from '@core/nfts/stores'
    import { persistErc721Nft } from '@core/nfts/actions/persistErc721Nft'
    import { updateAllAccountNftsForAccount } from '@core/nfts/actions'
    import { buildNftFromPersistedErc721Nft } from '@core/nfts'
    import { openUrlInBrowser } from '@core/app'
    import { TIDE_BASE_URL, TideWebsiteEndpoint } from '@core/tide'
    import { handleError } from '@core/error/handlers'

    const tideApi = new TideApi()
    const evmChain = getNetwork()?.getChains()?.[0]?.getConfiguration()

    let imageLoadError = false
    let leaderboardLoading = false
    let leaderboardError = false
    let userAddress: string

    $: campaign = $campaignLeaderboards[$selectedCampaign.projectId]?.[$selectedCampaign.id]
    $: fetchAndPersistUserData($selectedAccount)

    $: userNft = $ownedNfts.find((nft) => nft.id?.startsWith($selectedCampaign.address.toLowerCase()))

    function fetchAndPersistUserData(account: IAccountState): void {
        userAddress = getAddressFromAccountForNetwork(account, evmChain.id)?.toLowerCase()
        void fetchAndPersistUserPosition(userAddress)
        void fetchAndPersistUserNft(userAddress, account.index)
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
            Number(evmChain.chainId),
            accountAddress,
            $selectedCampaign.address
        )
        if (!tokenId) {
            return
        }

        try {
            const persistedNft = await persistErc721Nft($selectedCampaign.address, tokenId, evmChain.id)
            if (persistedNft) {
                const nft = buildNftFromPersistedErc721Nft(persistedNft, accountAddress)
                updateAllAccountNftsForAccount(index, nft)
            }
        } catch (_) {
            // Switching account too swiftly results in an error from persistErc721Nft.
        }
    }

    onMount(async () => {
        if (!campaign?.board) {
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

<div class="h-full flex flex-col gap-8">
    <Pane
        classes="
            w-full shrink-0 grid grid-cols-3
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
            <div class="w-full flex flex-col items-start p-5 gap-4">
                <Text type="base" textColor="secondary">{$selectedCampaign.description}</Text>
            </div>
        </div>
    </Pane>

    <div class="flex-grow grid grid-cols-7 gap-8 items-start">
        <div class="h-full col-span-5">
            <Leaderboard
                leaderboardItems={campaign?.board}
                {userAddress}
                networkId={evmChain.id}
                loading={leaderboardLoading}
                error={leaderboardError}
            />
        </div>
        <div class="col-span-2">
            <UserPositionCard userPosition={campaign?.userPosition} nft={userNft} />
        </div>
    </div>
</div>
