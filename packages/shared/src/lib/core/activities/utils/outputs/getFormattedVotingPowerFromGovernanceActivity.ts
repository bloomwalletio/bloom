import { getBaseToken } from '@core/profile'
import { GovernanceAction } from '@core/activities/enums'
import { GovernanceActivity } from '@core/activities/types'
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
