import { GovernanceAction } from '@core/activity/enums'
import { GovernanceActivity } from '@core/activity/types'
import { getBaseToken } from '@core/profile/actions'
import { formatTokenAmountBestMatch } from '@core/wallet/utils'

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
