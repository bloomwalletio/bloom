import { writable } from 'svelte/store'
import { ILeaderBoard } from '../interfaces/leaderboard.interface'

export const leaderboards = writable<{ [key: string]: ILeaderBoard }>({})

export function addLeaderboard(projectId: string, leaderboard: ILeaderBoard): void {
    leaderboards.update((state) => {
        state[projectId] = leaderboard
        return state
    })
}
