<script lang="ts">
    import { onMount } from 'svelte'
    import Leaderboard from '../components/Leaderboard.svelte'
    import { leaderboards, ILeaderboard } from '@contexts/campaigns'

    const projectId = '536' // ?? $selectedCampaign.projectId

    onMount(async () => {
        // if (!$leaderboards[projectId]) {
        const response = await fetch(`https://api-prod.tideprotocol.xyz/public/project/${projectId}/leaderboard`)
        const leaderboardResponse = (await response.json()) as ILeaderboard
        $leaderboards[projectId] = leaderboardResponse
        //         }
    })
</script>

<Leaderboard rankings={$leaderboards[projectId]?.leaderboardFiltered} />
