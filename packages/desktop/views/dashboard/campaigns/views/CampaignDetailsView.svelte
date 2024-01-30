<script lang="ts">
    import {
        addCampaignLeaderboard,
        addUserPositionToCampaignLeaderboard,
        campaignLeaderboards,
        selectedCampaign,
    } from '@contexts/campaigns'
    import { IAccountState, getAddressFromAccountForNetwork } from '@core/account'
    import { selectedAccount } from '@core/account/stores'
    import { handleError } from '@core/error/handlers'
    import { NetworkId, NetworkNamespace, getChainConfiguration } from '@core/network'
    import { buildNftFromPersistedErc721Nft } from '@core/nfts'
    import { addNftsToDownloadQueue, updateAllAccountNftsForAccount } from '@core/nfts/actions'
    import { persistErc721Nft } from '@core/nfts/actions/persistErc721Nft'
    import { ownedNfts } from '@core/nfts/stores'
    import { TideApi } from '@core/tide/apis'
    import { onMount } from 'svelte'
    import Leaderboard from '../components/Leaderboard.svelte'
    import UserPositionCard from '../components/UserPositionCard.svelte'
    import CampaignHeader from '../components/CampaignHeader.svelte'

    const tideApi = new TideApi()
    let leaderboardLoading = false
    let leaderboardError = false
    let userAddress: string
    let numberOfTasks: number | undefined

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
                void addNftsToDownloadQueue([nft])
                updateAllAccountNftsForAccount(index, nft)
            }
        } catch (_) {
            // Switching account too swiftly results in an error from persistErc721Nft.
        }
    }

    onMount(async () => {
        numberOfTasks = (await tideApi.getCampaign($selectedCampaign.id)).numberOfTasks
        await fetchAndPersistLeaderboard()
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
</script>

<div class="h-full flex flex-col gap-4">
    <CampaignHeader campaign={$selectedCampaign} />

    <div class="flex-grow grid grid-cols-7 gap-4 items-start shrink-0 h-3/4">
        <div class="col-span-5 h-full overflow-scroll">
            <Leaderboard
                leaderboardItems={leaderboard}
                {userAddress}
                networkId={chainConfiguration?.id}
                loading={leaderboardLoading && (!leaderboard || leaderboard.length === 0)}
                error={leaderboardError}
            />
        </div>
        <div class="h-full flex flex-col flex-grow gap-8 col-span-2">
            <UserPositionCard {userPosition} nft={userNft} {numberOfTasks} />
        </div>
    </div>
</div>
