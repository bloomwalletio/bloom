<script lang="ts">
    import {
        CAMPAIGN_POLL_INTERVAL,
        addCampaignLeaderboard,
        addUserPositionToCampaignLeaderboard,
        campaignLeaderboards,
        selectedCampaign,
    } from '@contexts/campaigns'
    import { IAccountState, getAddressFromAccountForNetwork } from '@core/account'
    import { selectedAccount } from '@core/account/stores'
    import { handleError } from '@core/error/handlers'
    import { EvmNetworkId, NetworkNamespace, getEvmNetwork } from '@core/network'
    import { buildNftFromPersistedErc721Nft } from '@core/nfts'
    import { addNftsToDownloadQueue, persistAndUpdateCollections } from '@core/nfts/actions'
    import { persistErc721Nft } from '@core/nfts/actions/persistErc721Nft'
    import { addOrUpdateNftForAccount, ownedNfts } from '@core/nfts/stores'
    import { TideApi } from '@core/tide/apis'
    import { onDestroy, onMount } from 'svelte'
    import Leaderboard from '../components/Leaderboard.svelte'
    import UserPositionCard from '../components/UserPositionCard.svelte'
    import CampaignHeader from '../components/CampaignHeader.svelte'

    const tideApi = new TideApi()
    let leaderboardLoading = false
    let leaderboardError = false
    let userAddress: string
    let numberOfTasks: number | undefined

    $: evmNetwork = getEvmNetwork(`${NetworkNamespace.Evm}:${$selectedCampaign.chainId}` as EvmNetworkId)
    $: ({ board: leaderboard, userPosition } = $campaignLeaderboards[$selectedCampaign.projectId]?.[
        $selectedCampaign.id
    ] ?? { board: undefined, userPosition: undefined })
    $: fetchAndPersistTideData($selectedAccount, evmNetwork?.id)
    $: userNft = $ownedNfts.find((nft) => nft.id?.startsWith($selectedCampaign.address.toLowerCase()))

    function fetchAndPersistTideData(account: IAccountState, networkId: EvmNetworkId): void {
        if (networkId) {
            userAddress = getAddressFromAccountForNetwork(account, networkId)?.toLowerCase()
            void fetchAndPersistUserPosition(userAddress)
            void fetchAndPersistUserNft(userAddress, account.index)
            void fetchAndPersistLeaderboard()
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
        if (userNft || numberOfTasks !== userPosition?.taskDone) {
            return
        }

        const { tokenId } = await tideApi.getNftUserData(
            $selectedCampaign.chainId,
            accountAddress,
            $selectedCampaign.address
        )
        if (!tokenId || !evmNetwork) {
            return
        }

        try {
            const persistedNft = await persistErc721Nft(
                $selectedCampaign.address,
                tokenId,
                evmNetwork.id,
                $selectedAccount
            )
            if (persistedNft) {
                const nft = buildNftFromPersistedErc721Nft(persistedNft, accountAddress)
                void addNftsToDownloadQueue([nft])
                addOrUpdateNftForAccount(index, nft)
                await persistAndUpdateCollections(index, [nft])
            }
        } catch (_) {
            // Switching account too swiftly results in an error from persistErc721Nft.
        }
    }

    async function fetchAndPersistLeaderboard(): Promise<void> {
        try {
            leaderboardLoading = true
            const leaderboardResponse = await tideApi.getProjectLeaderboard($selectedCampaign.projectId, {
                cids: [$selectedCampaign.id],
            })
            addCampaignLeaderboard(
                $selectedCampaign.projectId,
                $selectedCampaign.id,
                leaderboardResponse.filteredLeaderboard,
                leaderboardResponse.leaderboardUserCount
            )
            leaderboardLoading = false
        } catch (error) {
            handleError(error)
            leaderboardError = true
            leaderboardLoading = false
        }
    }

    async function fetchTasks(): Promise<void> {
        numberOfTasks = (await tideApi.getCampaign($selectedCampaign.id)).numberOfTasks
    }

    $: $selectedAccount, restartPolling()
    function restartPolling(): void {
        clearInterval(pollInterval)
        pollInterval = setInterval(
            () => void fetchAndPersistTideData($selectedAccount, evmNetwork?.id),
            CAMPAIGN_POLL_INTERVAL
        )
    }

    let pollInterval: NodeJS.Timer
    onMount(() => {
        restartPolling()
        void fetchTasks()
    })

    onDestroy(() => {
        clearInterval(pollInterval)
    })
</script>

<div class="h-full flex flex-col gap-4">
    <CampaignHeader campaign={$selectedCampaign} />

    <div class="flex-1 grid grid-cols-7 gap-4 items-start overflow-hidden">
        <div class="h-full col-span-5 overflow-hidden">
            <Leaderboard
                leaderboardItems={leaderboard}
                {userAddress}
                networkId={evmNetwork?.id}
                loading={leaderboardLoading && (!leaderboard || leaderboard.length === 0)}
                error={leaderboardError}
            />
        </div>
        <div class="h-full col-span-2">
            <UserPositionCard {userPosition} nft={userNft} {numberOfTasks} />
        </div>
    </div>
</div>
