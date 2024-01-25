<script lang="ts">
    import { onMount } from 'svelte'
    import Leaderboard from '../components/Leaderboard.svelte'
    import { leaderboards, addLeaderboard } from '@contexts/campaigns'
    import { TideApi } from '@core/tide/apis'

    const projectId = 536 // ?? $selectedCampaign.projectId

    onMount(async () => {
        if (!$leaderboards[projectId]) {
            const tideApi = new TideApi()

            const leaderboard = await tideApi.getProjectLeaderboard(projectId)
            addLeaderboard(projectId, {
                board: leaderboard.filteredLeaderboard,
                userPosition: leaderboard.userPosition,
            })
        }
    })
</script>

{#if $leaderboards[projectId]?.board}
    <Leaderboard rankings={$leaderboards[projectId]?.board} />
{/if}
