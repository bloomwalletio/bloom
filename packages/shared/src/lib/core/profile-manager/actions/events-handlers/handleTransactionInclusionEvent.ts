import { updateParticipationOverview } from '@contexts/governance/stores'
import { isAccountVoting } from '@contexts/governance/utils/isAccountVoting'
import { syncVotingPower } from '@core/account/actions'
import { get } from 'svelte/store'
import {
    ActivityAction,
    ActivityDirection,
    StardustActivityType,
    InclusionState,
    getActivityByTransactionId,
    updateActivityByTransactionId,
    updateClaimingTransactionInclusion,
} from '@core/activity'
import { StardustGovernanceActivity } from '@core/activity/types'
import { updateNftInAllAccountNftsForAccount } from '@core/nfts/actions'
import { updateActiveAccountPersistedData } from '@core/profile/actions'
import { activeAccounts, updateActiveAccount } from '@core/profile/stores'
import { PopupId, closePopup, openPopup } from '../../../../../../../desktop/lib/auxiliary/popup'
import { validateWalletApiEvent } from '../../utils'
import { Event, TransactionInclusionWalletEvent, WalletEventType } from '@iota/sdk/out/types'

export function handleTransactionInclusionEvent(error: Error, event: Event): void {
    const walletEvent = validateWalletApiEvent<TransactionInclusionWalletEvent>(
        error,
        event,
        WalletEventType.TransactionInclusion
    )
    handleTransactionInclusionEventInternal(event.accountIndex, walletEvent)
}

export function handleTransactionInclusionEventInternal(
    accountIndex: number,
    walletEvent: TransactionInclusionWalletEvent
): void {
    const { inclusionState, transactionId } = walletEvent
    updateActivityByTransactionId(accountIndex, transactionId, { inclusionState })

    const activity = getActivityByTransactionId(accountIndex, transactionId)

    if (activity?.type === StardustActivityType.Nft) {
        const isSpendable =
            (activity.direction === ActivityDirection.Incoming ||
                activity.direction === ActivityDirection.SelfTransaction) &&
            activity.action !== ActivityAction.Burn
        updateNftInAllAccountNftsForAccount(accountIndex, activity.nftId, { isSpendable })
    }

    if (activity?.type === StardustActivityType.Governance) {
        handleGovernanceTransactionInclusionEvent(accountIndex, inclusionState, activity)
    }

    updateClaimingTransactionInclusion(transactionId, inclusionState, accountIndex)
}

function handleGovernanceTransactionInclusionEvent(
    accountIndex: number,
    inclusionState: InclusionState,
    activity: StardustGovernanceActivity
): void {
    if (inclusionState === InclusionState.Confirmed) {
        // TODO: Normally we update active account after a wallet.rs returns a transaction
        // With governance we wait for the transaction confirmation
        // we should think about making this consistent in the future
        updateActiveAccount(accountIndex, { isTransferring: false })
        // TODO: move this
        closePopup({ forceClose: true })

        const account = get(activeAccounts)?.find((_account) => _account.index === accountIndex)
        if (!account) {
            return
        }
        if (account.hasVotingPowerTransactionInProgress) {
            updateActiveAccount(accountIndex, { hasVotingPowerTransactionInProgress: false })
            if (isAccountVoting(accountIndex) && activity.votingPower !== BigInt(0)) {
                updateActiveAccountPersistedData(accountIndex, { shouldRevote: true })
                openPopup({ id: PopupId.Revote })
            }
        } else {
            updateActiveAccount(accountIndex, { hasVotingTransactionInProgress: false })
            updateActiveAccountPersistedData(accountIndex, { shouldRevote: false })
        }
        void updateParticipationOverview(accountIndex)
    }
    syncVotingPower(accountIndex)
}
