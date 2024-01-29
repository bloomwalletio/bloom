<script lang="ts">
    import { Button, IconName, Text } from '@bloomwalletio/ui'
    import { SupportedNetworkId, getNetwork } from '@core/network'
    import { MimeType, Nft, NftStandard } from '@core/nfts'
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
    import { IAccountState, getAddressFromAccountForNetwork } from '@core/account'
    import { openUrlInBrowser } from '@core/app'

    const tideApi = new TideApi()
    const userNft: Nft = {
        id: '0x9cb0f842bb6f827806f46cbbf62a494e6779bd08:1',
        type: MimeType.ImagePng,
        networkId: SupportedNetworkId.ShimmerEvm,
        name: 'MafiaBird #1',
        isLoaded: true,
        isSpendable: false,
        standard: NftStandard.Erc721,
        uri: 'https://tideprotocol.infura-ipfs.io/ipfs/QmZHMqGJ69SCofyoXtKaXxrLnoKBbGL92aC5NC79sk9Aks',
        contractMetadata: {
            standard: NftStandard.Erc721,
            address: '0x9cb0f842bb6f827806f46cbbf62a494e6779bd08',
            name: 'MafiaBirds',
            symbol: 'MB',
        },
        tokenId: '1',
        metadata: {
            type: MimeType.ImagePng,
            name: 'MafiaBird #1',
            description:
                'Are you ready to become a made bird and dive into The Magpie Mafia? 🐦🗡️ Enter the gang, climb your way up thru the ranks of a fun-oriented mafia-style organization, and be rewarded for your activity. 🔥🫡  By joining, you will earn your own nontransferable Magpie Mafia NFT that will level up based on your activity while acting as your way to access future Magpie Mafia functions, track your reputation, and more! 💣From here onwards, each time you’d like to engage in a campaign, join an event, or track your reputation, just show that you’re a member of The Magpie Mafia and join in on all the fun. 💰The beak speaks, the words of The Magpie Mafia carries with it authority and respect. 🪖',
            image: 'https://tideprotocol.infura-ipfs.io/ipfs/QmZHMqGJ69SCofyoXtKaXxrLnoKBbGL92aC5NC79sk9Aks',
            attributes: [
                {
                    trait_type: 'Body',
                    value: 'Rocco',
                },
                {
                    trait_type: 'Clothes',
                    value: 'Harlem',
                },
                {
                    trait_type: 'Background',
                    value: 'Empire State Building',
                },
                {
                    trait_type: 'Role',
                    value: 'Ally',
                },
                {
                    trait_type: 'Weapon',
                    value: 'Bird Knuckles',
                },
                {
                    trait_type: 'XP',
                    value: '65',
                },
            ],
        },
    }

    let imageLoadError = false

    $: campaign = $campaignLeaderboards[$selectedCampaign.projectId]?.[$selectedCampaign.id]
    $: fetchAndPersistUserPosition($selectedAccount)

    async function fetchAndPersistUserPosition(account: IAccountState): Promise<void> {
        const evmChainId = getNetwork()?.getChains()?.[0]?.getConfiguration().id
        const userAddress = getAddressFromAccountForNetwork(account, evmChainId)?.toLowerCase()

        const leaderboardResponse = await tideApi.getProjectLeaderboard($selectedCampaign.projectId, {
            cids: [$selectedCampaign.id],
            by: 'ADDRESS',
            search: userAddress,
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

    function onProjectClick(): void {
        openUrlInBrowser(`https://tideprotocol.xyz/users/spaces/${$selectedCampaign.projectId}`)
    }

    function onCampaignClick(): void {
        openUrlInBrowser(`https://tideprotocol.xyz/users/campaign/${$selectedCampaign.id}`)
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
            <div class="p-4">
                <img
                    src={$selectedCampaign.image}
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
                    <Button icon={IconName.Send} variant="outlined" on:click={onProjectClick} text="Project Page" />
                    <Button icon={IconName.Send} on:click={onCampaignClick} text="Campaign" />
                </div>
            </div>
            <div class="w-full flex flex-col items-start p-5 gap-4">
                <Text type="base" textColor="secondary">{$selectedCampaign.description}</Text>
            </div>
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
