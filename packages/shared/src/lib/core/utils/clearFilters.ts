import { proposalFilter } from '@contexts/governance/stores'
import { assetFilter } from '@core/wallet'
import { activityFilter } from '@core/activities'

export function clearFilters(): void {
    proposalFilter.update((state) => {
        for (const key in state) {
            state[key].active = false
            state[key].value = undefined
        }
        return state
    })

    assetFilter.update((state) => {
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
