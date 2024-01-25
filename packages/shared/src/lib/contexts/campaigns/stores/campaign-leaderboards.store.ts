import { writable } from 'svelte/store'
import { ITideLeaderboardItem } from '@core/tide/interfaces'

export const campaignLeaderboards = writable<{
    [projectId: number]: {
        [campaignId: number]: ITideLeaderboardItem[]
    }
}>({})

export function addCampaignLeaderboard(
    projectId: number,
    campaignId: number,
    leaderboard: ITideLeaderboardItem[]
): void {
    campaignLeaderboards.update((state) => {
        if (!state[projectId]) {
            state[projectId] = {}
        }
        state[projectId][campaignId] = leaderboard
        return state
    })
}
