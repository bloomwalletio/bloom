import { showNotification } from '@auxiliary/notification'
import { selectedAccount } from '@core/account/stores'
import { hiddenActivities, updateAsyncDataByActivityId } from '@core/activity/stores'
import { localize } from '@core/i18n'
import { activeProfileId } from '@core/profile/stores'
import { get } from 'svelte/store'

export function rejectActivity(id: string): void {
    const accountIndex = get(selectedAccount).index
    hiddenActivities.update((state) => {
        const profileId = get(activeProfileId)
        if (Array.isArray(state)) {
            // needed because of legacy way to store hidden activities
            state = {}
        }
        if (!state[profileId]) {
            state[profileId] = {}
        }
        if (!state[profileId][accountIndex]) {
            state[profileId][accountIndex] = []
        }
        state[profileId][accountIndex].push(id)
        return state
    })

    updateAsyncDataByActivityId(accountIndex, id, { isRejected: true })
    showNotification({
        variant: 'success',
        text: localize('notifications.hideActivity.success'),
    })
}
