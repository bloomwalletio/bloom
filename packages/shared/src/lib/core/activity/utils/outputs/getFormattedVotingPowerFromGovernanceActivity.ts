import { GovernanceAction } from '@core/activity/enums'
import { StardustGovernanceActivity } from '@core/activity/types'
import { getBaseToken } from '@core/profile/actions'
import { formatTokenAmountBestMatch } from '@core/token'

export function getFormattedVotingPowerFromGovernanceActivity(activity: StardustGovernanceActivity): string {
    if (
        activity.governanceAction === GovernanceAction.IncreaseVotingPower ||
        activity.governanceAction === GovernanceAction.DecreaseVotingPower
    ) {
        const amount = formatTokenAmountBestMatch(activity.votingPowerDifference, getBaseToken())
        return `${activity.governanceAction === GovernanceAction.DecreaseVotingPower ? '- ' : ''}${amount}`
    }
    // TODO
    return '0 SMR'
}
