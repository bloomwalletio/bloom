import { NetworkNamespace } from '@core/network'
import {
    ActivityAction,
    ActivityDirection,
    InclusionState,
    StardustActivityType,
    StardustGovernanceAction,
} from '../enums'
import { EvmActivityType } from '../enums/evm'
import { Activity } from '../types'

export function getActivityTileAction(activity: Activity): string | undefined {
    const { namespace, isInternal, direction, inclusionState, action } = activity
    const isConfirmed = inclusionState === InclusionState.Confirmed

    if (namespace === NetworkNamespace.Stardust) {
        if (activity.type === StardustActivityType.Basic && activity.isShimmerClaiming) {
            return isConfirmed ? 'general.shimmerClaimed' : 'general.shimmerClaiming'
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
    } else if (namespace === NetworkNamespace.Evm) {
        if (
            activity.type === EvmActivityType.CoinTransfer ||
            activity.type === EvmActivityType.TokenTransfer ||
            activity.type === EvmActivityType.BalanceChange
        ) {
            if (direction === ActivityDirection.Outgoing) {
                return isConfirmed ? 'general.sent' : 'general.sending'
            } else {
                return isConfirmed ? 'general.received' : 'general.receiving'
            }
        } else if (activity.type === EvmActivityType.TokenMinting) {
            return 'general.minted'
        } else if (activity.type === EvmActivityType.ContractCall) {
            return 'general.contractCall'
        } else {
            return 'general.unknown'
        }
    } else {
        return 'general.unknown'
    }
}
