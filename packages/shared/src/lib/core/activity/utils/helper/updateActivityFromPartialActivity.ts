import { StardustActivityType } from '@core/activity/enums'
import { StardustActivity } from '@core/activity/types'

export function updateActivityFromPartialActivity(
    activity: StardustActivity,
    partialData: Partial<StardustActivity>
): void {
    if (partialData.type === StardustActivityType.Basic && activity.type === StardustActivityType.Basic) {
        Object.assign(activity, partialData)
    } else if (partialData.type === StardustActivityType.Foundry && activity.type === StardustActivityType.Foundry) {
        Object.assign(activity, partialData)
    } else if (partialData.type === StardustActivityType.Alias && activity.type === StardustActivityType.Alias) {
        Object.assign(activity, partialData)
    } else if (partialData.type === StardustActivityType.Nft && activity.type === StardustActivityType.Nft) {
        Object.assign(activity, partialData)
    }
}
