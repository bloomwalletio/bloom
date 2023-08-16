import { isOnboardingLedgerProfile } from '@contexts/onboarding'
import { selectedAccountIndex } from '@core/account'
import { ledgerNanoStatus } from '@core/ledger'
import { deconstructLedgerVerificationProps } from '@core/ledger/helpers'
import { isActiveLedgerProfile } from '@core/profile'
import {
    Event,
    PreparedTransactionEssenceHashProgress,
    TransactionProgress,
    TransactionProgressType,
    TransactionProgressWalletEvent,
    WalletEventType,
    PreparedTransactionEssenceHashProgress,
} from '@iota/sdk/out/types'

export function handleTransactionProgressEvent(error: Error, event: Event): void {
    const walletEvent = validateWalletApiEvent<TransactionProgressWalletEvent>(
        error,
        event,
        WalletEventType.TransactionProgress
    )
    handleTransactionProgressEventInternal(event.accountIndex, walletEvent)
}

export function handleTransactionProgressEventInternal(
    accountIndex: number,
    walletEvent: TransactionProgressWalletEvent
): void {
    const { progress } = walletEvent
    if (get(isActiveLedgerProfile)) {
        if (get(selectedAccountIndex) === accountIndex) {
            openPopupIfVerificationNeeded(progress)
        }
    } else if (get(isOnboardingLedgerProfile)) {
        openPopupIfVerificationNeeded(progress)
    } else {
        console.warn('Transaction progress handler unimplemented for TransactionProgressType ', progress)
    }
}

function openPopupIfVerificationNeeded(progress: TransactionProgress): void {
    const { type } = progress
    if (type) {
        if (type === TransactionProgressType.PreparedTransaction) {
            openPopup({
                id: PopupId.VerifyLedgerTransaction,
                hideClose: true,
                preventClose: true,
                props: {
                    ...deconstructLedgerVerificationProps(),
                },
            })
        } else if (type === TransactionProgressType.PreparedTransactionEssenceHash) {
            if (get(ledgerNanoStatus)?.blindSigningEnabled) {
                openPopup({
                    id: PopupId.VerifyLedgerTransaction,
                    hideClose: true,
                    preventClose: true,
                    props: {
                        hash: (progress as PreparedTransactionEssenceHashProgress).hash,
                    },
                })
            } else {
                openPopup({
                    id: PopupId.EnableLedgerBlindSigning,
                    hideClose: true,
                    preventClose: true,
                })
            }
        } else if (type === TransactionProgressType.PerformingPow) {
            closePopup(true)
        }
    } else {
        throw new MissingTransactionProgressEventPayloadError()
    }
}
