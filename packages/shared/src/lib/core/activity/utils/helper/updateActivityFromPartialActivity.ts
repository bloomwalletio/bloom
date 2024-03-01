import { ActivityType } from '@core/activity/enums'
import { StardustActivity } from '@core/activity/types'

export function updateActivityFromPartialActivity(
    activity: StardustActivity,
    partialData: Partial<StardustActivity>
): void {
    if (partialData.type === ActivityType.Basic && activity.type === ActivityType.Basic) {
        Object.assign(activity, partialData)
    } else if (partialData.type === ActivityType.Foundry && activity.type === ActivityType.Foundry) {
        Object.assign(activity, partialData)
    } else if (partialData.type === ActivityType.Alias && activity.type === ActivityType.Alias) {
        Object.assign(activity, partialData)
    } else if (partialData.type === ActivityType.Nft && activity.type === ActivityType.Nft) {
        Object.assign(activity, partialData)
    }
}
