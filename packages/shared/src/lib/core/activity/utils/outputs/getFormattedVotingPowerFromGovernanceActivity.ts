import { GovernanceAction } from '@core/activity/enums'
import { GovernanceActivity } from '@core/activity/types'
import { getBaseToken } from '@core/profile'
import { formatTokenAmountBestMatch } from '@core/token'

export function getFormattedVotingPowerFromGovernanceActivity(activity: GovernanceActivity): string {
    if (
        activity.governanceAction === GovernanceAction.IncreaseVotingPower ||
        activity.governanceAction === GovernanceAction.DecreaseVotingPower
    ) {
        const amount = formatTokenAmountBestMatch(activity.votingPowerDifference, getBaseToken(), 2)
        return `${activity.governanceAction === GovernanceAction.DecreaseVotingPower ? '- ' : ''}${amount}`
    }
    // TODO
    return '0 SMR'
}
