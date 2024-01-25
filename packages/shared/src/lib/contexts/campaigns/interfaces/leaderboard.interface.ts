export interface ILeaderBoard {
    leaderboardFiltered: {
        address: string
        taskDone: number
        rewardClaimed: number
        position: number
        xpEarned: number
    }[]
    nextPage: number
    leaderboardUserCount: number
    userPosition: {
        address: string
        position: number
        rewardClaimed: number
        taskDone: number
        totalXp: number
    }
}
