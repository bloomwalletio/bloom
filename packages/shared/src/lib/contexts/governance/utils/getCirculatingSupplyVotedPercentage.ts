import { IProfile } from '@core/profile/interfaces'
import { activeProfile } from '@core/profile/stores'
import { get } from 'svelte/store'
import { ParticipationEventStatus } from '@iota/sdk'
import { IProposal } from '../interfaces'
import { calculatePercentageOfBigInt, getSignificantDigitsAndRound } from '@core/utils/number'
import { getDecimalSeparator } from '@core/i18n'

export function getCirculatingSupplyVotedPercentage(
    participationEventStatus: ParticipationEventStatus,
    proposal: IProposal,
    profile: IProfile = get(activeProfile)
): string {
    const circulatingSupply = profile.network.protocol?.circulatingSupply
    if (!circulatingSupply || !participationEventStatus?.questions || !proposal?.milestones) {
        return '0%'
    }

    const totalEventVotes = participationEventStatus.questions[0].answers.reduce(
        (total, answer) => (total += BigInt(answer.accumulated)),
        BigInt(0)
    )
    const milestoneCount = proposal.milestones.ended - proposal.milestones.holding
    const maximumVotes = BigInt(circulatingSupply) * BigInt(milestoneCount)

    const percentage = calculatePercentageOfBigInt(totalEventVotes, maximumVotes, 6)
    const percentageWithSignificantDigits = getSignificantDigitsAndRound(Number(percentage))
    const percentageString = String(percentageWithSignificantDigits).replace(/[,.]/g, getDecimalSeparator()) + '%'

    return percentageString
}
