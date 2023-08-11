import { selectedAccountIndex } from '@core/account/stores'
import type { TrackedParticipationOverview } from '@iota/wallet'
import { get } from 'svelte/store'
import { getParticipationsForProposal } from './getParticipationsForProposal'

export function isVotingForProposal(proposalId: string, accountIndex = get(selectedAccountIndex)): boolean {
    const participations = getParticipationsForProposal(proposalId, accountIndex) ?? {}
    const participationOutputs: TrackedParticipationOverview[] = Object.values(participations)
    return participationOutputs.some((output) => output?.endMilestoneIndex === 0)
}
