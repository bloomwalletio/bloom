import {
    ActivityAction,
    ActivityDirection,
    StardustActivityType,
    StardustGovernanceAction,
    InclusionState,
} from '../enums'
import { StardustActivity } from '../types'

export function getActivityTileAction(activity: StardustActivity): string | undefined {
    const { isInternal, direction, inclusionState, action } = activity
    const isConfirmed = inclusionState === InclusionState.Confirmed

    if (activity.type === StardustActivityType.Basic && activity.isShimmerClaiming) {
        return isConfirmed ? 'general.shimmerClaimed' : 'general.shimmerClaiming'
    }
    if (activity.type === StardustActivityType.SmartContract) {
        return 'general.contractCall'
    }
    if (activity.type === StardustActivityType.Governance) {
        if (activity.governanceAction === StardustGovernanceAction.IncreaseVotingPower) {
            return isConfirmed ? 'general.increased' : 'general.increasing'
        } else if (activity.governanceAction === StardustGovernanceAction.DecreaseVotingPower) {
            return isConfirmed ? 'general.decreased' : 'general.decreasing'
        } else if (activity.governanceAction === StardustGovernanceAction.StartVoting) {
            return isConfirmed ? 'general.votedOn' : 'general.votingOn'
        } else if (activity.governanceAction === StardustGovernanceAction.StopVoting) {
            return isConfirmed ? 'general.unvoted' : 'general.unvoting'
        } else if (activity.governanceAction === StardustGovernanceAction.ChangedVote) {
            return isConfirmed ? 'general.changedVote' : 'general.changingVote'
        } else if (activity.governanceAction === StardustGovernanceAction.Revote) {
            return isConfirmed ? 'general.revoted' : 'general.revoting'
        }
    } else if (activity.type === StardustActivityType.Consolidation) {
        return isConfirmed ? 'general.consolidated' : 'general.consolidating'
    } else if (action === ActivityAction.Mint) {
        return isConfirmed ? 'general.minted' : 'general.minting'
    } else if (action === ActivityAction.Burn) {
        return isConfirmed ? 'general.burned' : 'general.burning'
    } else if (action === ActivityAction.BalanceChange) {
        return direction === ActivityDirection.Outgoing ? 'general.balanceDecreased' : 'general.balanceIncreased'
    } else if (action === ActivityAction.InitialBalance) {
        return 'general.initialBalance'
    } else if (action === ActivityAction.Send) {
        const isReceived = [
            ActivityDirection.Incoming,
            ActivityDirection.SelfTransaction,
            ActivityDirection.Genesis,
        ].includes(direction)
        if (isReceived) {
            return isConfirmed ? 'general.received' : 'general.receiving'
        }

        if (isInternal) {
            return isConfirmed ? 'general.transferred' : 'general.transferring'
        }
        return isConfirmed ? 'general.sent' : 'general.sending'
    } else {
        return 'general.unknown'
    }
}
