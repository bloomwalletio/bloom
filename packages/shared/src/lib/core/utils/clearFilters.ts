import { proposalFilter } from '@contexts/governance/stores'
import { activityFilter } from '@core/activity'
import { tokenFilter } from '@core/token/stores'

export function clearFilters(): void {
    proposalFilter.update((state) => {
        for (const key in state) {
            state[key].active = false
            state[key].value = undefined
        }
        return state
    })

    tokenFilter.update((state) => {
        for (const key in state) {
            state[key].active = false
            state[key].value = undefined
        }
        return state
    })

    activityFilter.update((state) => {
        for (const key in state) {
            state[key].active = false
            state[key].value = undefined
        }
        return state
    })
}
