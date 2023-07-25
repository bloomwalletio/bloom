import { get } from 'svelte/store'
import { selectedAccountIndex } from '@core/account'
import { ledgerNanoStatus } from '@core/ledger'
import { isActiveLedgerProfile } from '@core/profile'
import { isOnboardingLedgerProfile } from '@contexts/onboarding'
import { closePopup, openPopup, PopupId } from '../../../../../../../desktop/lib/auxiliary/popup'
import { deconstructLedgerVerificationProps } from '@core/ledger/helpers'

import { MissingTransactionProgressEventPayloadError } from '../../errors'
import { validateWalletApiEvent } from '../../utils'
import {
    Event,
    TransactionProgress,
    TransactionProgressType,
    TransactionProgressWalletEvent,
    WalletEventType,
    PreparedTransactionEssenceHashProgress,
} from '@iota/wallet/out/types'

export function handleTransactionProgressEvent(error: Error, walletEvent: Event): void {
    const { accountIndex, event } = validateWalletApiEvent(error, walletEvent, WalletEventType.TransactionProgress)
    handleTransactionProgressEventInternal(accountIndex, event as TransactionProgressWalletEvent)
}

export function handleTransactionProgressEventInternal(
    accountIndex: number,
    event: TransactionProgressWalletEvent
): void {
    const { progress } = event
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
