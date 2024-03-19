import { showNotification } from '@auxiliary/notification'
import { getSelectedAccount } from '@core/account/stores'
import { hiddenActivities, updateAsyncDataByActivityId } from '@core/activity/stores'
import { localize } from '@core/i18n'
import { getActiveProfileId } from '@core/profile/stores'

export function rejectActivity(id: string): void {
    const accountIndex = getSelectedAccount().index
    hiddenActivities.update((state) => {
        const profileId = getActiveProfileId()
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
