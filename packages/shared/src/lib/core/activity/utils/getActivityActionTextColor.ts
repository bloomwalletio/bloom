import { TextColor } from '@bloomwalletio/ui'
import {
    ActivityAction,
    ActivityDirection,
    StardustActivityType,
    StardustGovernanceAction,
    Activity,
} from '@core/activity'
import { NetworkNamespace } from '@core/network'
import { EvmActivityType } from '../enums/evm'

export function getActivityActionTextColor(activity: Activity): TextColor {
    const { namespace, type, direction, action } = activity
    if (namespace === NetworkNamespace.Stardust) {
        if (type === StardustActivityType.Basic && activity.isShimmerClaiming) {
            return 'info'
        }
        if (type === StardustActivityType.Governance) {
            if (
                [StardustGovernanceAction.StartVoting, StardustGovernanceAction.StopVoting].includes(
                    activity.governanceAction
                )
            ) {
                return 'secondary'
            }
            return 'primary'
        } else if (type === StardustActivityType.Consolidation) {
            return 'primary'
        } else if (action === ActivityAction.Mint) {
            return 'success'
        } else if (action === ActivityAction.Burn) {
            return 'danger'
        } else if (action === ActivityAction.Send) {
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
    } else if (namespace === NetworkNamespace.Evm) {
        if (
            type === EvmActivityType.CoinTransfer ||
            type === EvmActivityType.TokenTransfer ||
            type === EvmActivityType.BalanceChange
        ) {
            if (direction === ActivityDirection.Outgoing) {
                return 'brand'
            } else {
                return 'info'
            }
        } else if (EvmActivityType.TokenMinting) {
            return 'success'
        } else if (type === EvmActivityType.ContractCall) {
            return 'primary'
        } else {
            return 'secondary'
        }
    } else {
        return 'primary'
    }
}
