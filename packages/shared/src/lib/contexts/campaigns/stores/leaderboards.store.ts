import { writable } from 'svelte/store'
import { ILeaderBoard } from '../interfaces'

export const leaderboards = writable<{ [key: number]: ILeaderBoard }>({})

export function addLeaderboard(projectId: number, leaderboard: ILeaderBoard): void {
    leaderboards.update((state) => {
        state[projectId] = leaderboard
        return state
    })
}
