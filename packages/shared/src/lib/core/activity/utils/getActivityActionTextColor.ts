import { TextColor } from '@bloomwalletio/ui'
import { StardustActivity, ActivityAction, ActivityDirection, ActivityType, GovernanceAction } from '@core/activity'

export function getActivityActionTextColor(activity: StardustActivity): TextColor {
    const { type, direction, action } = activity

    if (type === ActivityType.Basic && activity.isShimmerClaiming) {
        return 'info'
    }
    if (type === ActivityType.Governance) {
        if ([GovernanceAction.StartVoting, GovernanceAction.StopVoting].includes(activity.governanceAction)) {
            return 'secondary'
        }
        return 'primary'
    } else if (type === ActivityType.Consolidation) {
        return 'primary'
    } else if (type === ActivityType.SmartContract) {
        return 'primary'
    } else if (action === ActivityAction.Mint) {
        return 'success'
    } else if (action === ActivityAction.Burn) {
        return 'danger'
    } else if (action === ActivityAction.InitialBalance) {
        return 'primary'
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
            return 'primary'
        }
    } else {
        return 'primary'
    }
}
