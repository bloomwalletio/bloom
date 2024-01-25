<script lang="ts">
    import { onMount } from 'svelte'
    import Leaderboard from '../components/Leaderboard.svelte'
    import { leaderboards, addLeaderboard, selectedCampaign } from '@contexts/campaigns'
    import { TideApi } from '@core/tide/apis'

    onMount(async () => {
        if (!$leaderboards[$selectedCampaign.projectId]) {
            const tideApi = new TideApi()

            const leaderboard = await tideApi.getProjectLeaderboard($selectedCampaign.projectId, {
                cids: [$selectedCampaign.id],
            })
            addLeaderboard($selectedCampaign.projectId, {
                board: leaderboard.filteredLeaderboard,
                userPosition: leaderboard.userPosition,
            })
        }
    })
</script>

{#if $leaderboards[$selectedCampaign.projectId]?.board}
    <Leaderboard leaderboardItems={$leaderboards[$selectedCampaign.projectId]?.board} />
{/if}
