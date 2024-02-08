import { Activity, ActivityAction, ActivityDirection, ActivityType } from '@core/activity'

export function getActivityActionColor(activity: Activity, darkMode: boolean): string {
    const { type, direction, action } = activity
    const neutralColor = darkMode ? 'neutral-1' : 'neutral-7'

    if (type === ActivityType.Basic && activity.isShimmerClaiming) {
        return 'info'
    }
    if (type === ActivityType.Governance) {
        return neutralColor
    } else if (type === ActivityType.Consolidation) {
        return neutralColor
    } else if (type === ActivityType.SmartContract) {
        return neutralColor
    } else if (action === ActivityAction.Mint) {
        return 'success'
    } else if (action === ActivityAction.Burn) {
        return 'danger'
    } else if (action === ActivityAction.InitialBalance) {
        return neutralColor
    } else if (action === ActivityAction.Send || action === ActivityAction.BalanceChange) {
        const isReceived = [
            ActivityDirection.Incoming,
            ActivityDirection.SelfTransaction,
            ActivityDirection.Genesis,
        ].includes(direction)

        if (direction === ActivityDirection.Outgoing) {
            return 'brand'
        } else if (isReceived) {
            return 'info'
        } else {
            return neutralColor
        }
    } else {
        return neutralColor
    }
}
