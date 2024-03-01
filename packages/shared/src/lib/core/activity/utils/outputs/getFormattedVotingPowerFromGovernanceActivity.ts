import { StardustGovernanceAction } from '@core/activity/enums'
import { StardustGovernanceActivity } from '@core/activity/types'
import { getBaseToken } from '@core/profile/actions'
import { formatTokenAmountBestMatch } from '@core/token'

export function getFormattedVotingPowerFromGovernanceActivity(activity: StardustGovernanceActivity): string {
    if (
        activity.governanceAction === StardustGovernanceAction.IncreaseVotingPower ||
        activity.governanceAction === StardustGovernanceAction.DecreaseVotingPower
    ) {
        const amount = formatTokenAmountBestMatch(activity.votingPowerDifference, getBaseToken())
        return `${activity.governanceAction === StardustGovernanceAction.DecreaseVotingPower ? '- ' : ''}${amount}`
    }
    // TODO
    return '0 SMR'
}
