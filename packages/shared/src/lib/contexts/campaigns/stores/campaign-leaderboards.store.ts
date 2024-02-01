import { writable } from 'svelte/store'
import { ITideLeaderboardItem } from '@core/tide/interfaces'

export const campaignLeaderboards = writable<{
    [projectId: number]: {
        [campaignId: string]: {
            board: ITideLeaderboardItem[]
            userPosition: ITideLeaderboardItem | undefined
        }
    }
}>({})

export function addCampaignLeaderboard(
    projectId: number,
    campaignId: string,
    leaderboard: ITideLeaderboardItem[]
): void {
    campaignLeaderboards.update((state) => {
        if (!state[projectId]) {
            state[projectId] = {}
        }
        if (!state[projectId][campaignId]) {
            state[projectId][campaignId] = { board: [], userPosition: undefined }
        }
        state[projectId][campaignId].board = leaderboard
        return state
    })
}

export function addUserPositionToCampaignLeaderboard(
    projectId: number,
    campaignId: string,
    userPosition: ITideLeaderboardItem
): void {
    campaignLeaderboards.update((state) => {
        if (!state[projectId]) {
            state[projectId] = {}
        }
        if (!state[projectId][campaignId]) {
            state[projectId][campaignId] = { board: [], userPosition: undefined }
        }
        state[projectId][campaignId].userPosition = userPosition
        return state
    })
}
