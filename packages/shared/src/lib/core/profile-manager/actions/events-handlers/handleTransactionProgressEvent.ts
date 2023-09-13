import { isOnboardingLedgerProfile } from '@contexts/onboarding'
import { selectedAccountIndex } from '@core/account/stores'
import { LedgerAppName } from '@core/ledger/enums'
import { ledgerDeviceState, ledgerPreparedOutput, resetLedgerPreparedOutput } from '@core/ledger/stores'
import { deconstructLedgerVerificationProps } from '@core/ledger/helpers'
import { isActiveLedgerProfile } from '@core/profile/stores'
import {
    Event,
    PreparedTransactionEssenceHashProgress,
    TransactionProgress,
    TransactionProgressType,
    TransactionProgressWalletEvent,
    WalletEventType,
} from '@iota/sdk/out/types'
import { get } from 'svelte/store'
import { PopupId, closePopup, openPopup } from '../../../../../../../desktop/lib/auxiliary/popup'
import { MissingTransactionProgressEventPayloadError } from '../../errors'
import { validateWalletApiEvent } from '../../utils'
import { checkOrConnectLedger } from '@core/ledger/actions'
import { handleError } from '@core/error/handlers'
import { sendOutput } from '@core/wallet/actions'

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
            if (get(ledgerDeviceState)?.settings?.[LedgerAppName.Shimmer]?.blindSigningEnabled) {
                openPopup({
                    id: PopupId.VerifyLedgerTransaction,
                    hideClose: true,
                    preventClose: true,
                    props: {
                        useBlindSigning: true,
                        hash: (progress as PreparedTransactionEssenceHashProgress).hash,
                    },
                })
            } else {
                openPopup({
                    id: PopupId.EnableLedgerBlindSigning,
                    hideClose: true,
                    preventClose: true,
                    props: {
                        appName: LedgerAppName.Shimmer,
                        onEnabled: () => {
                            checkOrConnectLedger(async () => {
                                try {
                                    if (get(ledgerPreparedOutput)) {
                                        await sendOutput(get(ledgerPreparedOutput))
                                        resetLedgerPreparedOutput()
                                    }
                                } catch (err) {
                                    handleError(err)
                                }
                            })
                        },
                    },
                })
            }
        } else if (type === TransactionProgressType.PerformingPow) {
            closePopup(true)
        }
    } else {
        throw new MissingTransactionProgressEventPayloadError()
    }
}
