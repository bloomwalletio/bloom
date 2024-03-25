import { StardustActivity, StardustActivityAsyncStatus, ActivityDirection } from '@core/activity'
import { getTimeDifference } from '@core/utils/time'

export function getActivityActionPill(
    activity: StardustActivity,
    currentDate: Date
): { type: 'timelock' | 'unclaimed' | 'expired'; timeDiff?: string } | undefined {
    if (!activity?.asyncData?.asyncStatus) {
        return undefined
    }

    const { asyncStatus, expirationDate, timelockDate } = activity.asyncData

    switch (asyncStatus) {
        case StardustActivityAsyncStatus.Claimed: {
            return undefined
        }
        case StardustActivityAsyncStatus.Timelocked: {
            if (activity.direction === ActivityDirection.Outgoing) {
                if (expirationDate) {
                    const timeDiff = getTimeDifference(expirationDate, currentDate)
                    return { type: 'unclaimed', timeDiff }
                } else {
                    return undefined
                }
            } else {
                if (!timelockDate) {
                    return undefined
                }
                const timeDiff = getTimeDifference(timelockDate, currentDate)
                return { type: 'timelock', timeDiff }
            }
        }
        case StardustActivityAsyncStatus.Unclaimed: {
            const timeDiff = expirationDate ? getTimeDifference(expirationDate, currentDate) : undefined
            return { type: 'unclaimed', timeDiff }
        }
        case StardustActivityAsyncStatus.Expired: {
            return { type: 'expired' }
        }
        default: {
            return undefined
        }
    }
}
