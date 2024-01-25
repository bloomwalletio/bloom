<script lang="ts">
    import { onMount } from 'svelte'
    import Leaderboard from '../components/Leaderboard.svelte'
    import { campaignLeaderboards, addCampaignLeaderboard, selectedCampaign } from '@contexts/campaigns'
    import { TideApi } from '@core/tide/apis'

    onMount(async () => {
        if (!$campaignLeaderboards[$selectedCampaign.projectId]?.[$selectedCampaign.id]) {
            const tideApi = new TideApi()

            const leaderboard = await tideApi.getProjectLeaderboard($selectedCampaign.projectId, {
                cids: [$selectedCampaign.id],
            })
            addCampaignLeaderboard($selectedCampaign.projectId, $selectedCampaign.id, leaderboard.filteredLeaderboard)
        }
    })
</script>

{#if $campaignLeaderboards[$selectedCampaign.projectId]?.[$selectedCampaign.id]}
    <Leaderboard leaderboardItems={$campaignLeaderboards[$selectedCampaign.projectId][$selectedCampaign.id]} />
{/if}
