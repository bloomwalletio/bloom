<script lang="ts">
    import { Text } from '@bloomwalletio/ui'
    import { getNetwork } from '@core/network'
    import { TideApi } from '@core/tide/apis'
    import Pane from '@ui/atoms/Pane.svelte'
    import { MediaPlaceholder } from '@ui/molecules'
    import NftGalleryItem from '@ui/molecules/NftGalleryItem.svelte'
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
    import { getAddressFromAccountForNetwork } from '@core/account'
    import { selectedAccountNfts } from '@core/nfts/stores'
    import { persistErc721Nft } from '@core/nfts/actions/persistErc721Nft'
    import { updateAllAccountNftsForAccount } from '@core/nfts/actions'
    import { buildNftFromPersistedErc721Nft } from '@core/nfts'

    const tideApi = new TideApi()
    const evmChain = getNetwork()?.getChains()?.[0]?.getConfiguration()

    let imageLoadError = false

    $: campaign = $campaignLeaderboards[$selectedCampaign.projectId]?.[$selectedCampaign.id]
    $: userAddress = getAddressFromAccountForNetwork($selectedAccount, evmChain.id)?.toLowerCase()
    $: fetchAndPersistUserPosition(userAddress)
    $: fetchAndPersistUserNft(userAddress)

    $: userNft = $selectedAccountNfts.find((nft) => nft.id?.startsWith($selectedCampaign.contractAddress.toLowerCase()))

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

    async function fetchAndPersistLeaderboard(): Promise<void> {
        const leaderboardResponse = await tideApi.getProjectLeaderboard($selectedCampaign.projectId, {
            cids: [$selectedCampaign.id],
        })
        addCampaignLeaderboard(
            $selectedCampaign.projectId,
            $selectedCampaign.id,
            leaderboardResponse.filteredLeaderboard
        )
    }

    async function fetchAndPersistUserNft(accountAddress: string): Promise<void> {
        if (!userNft) {
            const { tokenId } = await tideApi.getNftUserData(
                Number(evmChain.chainId),
                accountAddress,
                $selectedCampaign.contractAddress
            )
            const persistedNft = await persistErc721Nft($selectedCampaign.contractAddress, tokenId, evmChain.id)
            const nft = buildNftFromPersistedErc721Nft(persistedNft, accountAddress)
            updateAllAccountNftsForAccount($selectedAccount.index, nft)
        }
    }

    onMount(async () => {
        if (!campaign?.board) {
            await fetchAndPersistLeaderboard()
        }
    })
</script>

<div class="h-full flex flex-col gap-8">
    <Pane
        classes="
            w-full flex-grow shrink-0 grid grid-cols-3
            bg-surface dark:bg-surface-dark 
            border border-solid border-stroke dark:border-stroke-dark 
            divide-x divide-solid divide-stroke dark:divide-stroke-dark 
            shadow-lg
        "
    >
        {#if $selectedCampaign.image && !imageLoadError}
            <img
                src={$selectedCampaign.image}
                alt={$selectedCampaign?.title}
                class="w-full h-full object-cover"
                on:error={() => (imageLoadError = true)}
            />
        {:else}
            <div class="min-w-full h-full object-cover">
                <MediaPlaceholder size="md" />
            </div>
        {/if}
        <div class="col-span-2 p-6 space-y-2">
            <Text type="h2" classes="whitespace-nowrap">{$selectedCampaign.title}</Text>
            <Text type="body2">{$selectedCampaign.description}</Text>
        </div>
    </Pane>

    <div class="grid grid-cols-7 gap-8 items-start">
        <div class="col-span-5">
            {#if campaign}
                <Leaderboard leaderboardItems={campaign.board} />
            {/if}
        </div>
        <div class="flex flex-col flex-grow gap-8 col-span-2">
            <UserPositionCard userPosition={campaign?.userPosition} />
            <NftGalleryItem nft={userNft} />
        </div>
    </div>
</div>
