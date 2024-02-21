import { isOnboardingLedgerProfile } from '@contexts/onboarding'
import { selectedAccountIndex } from '@core/account/stores'
import { LedgerAppName } from '@core/ledger/enums'
import { ledgerDeviceState, ledgerPreparedOutput, resetLedgerPreparedOutput } from '@core/ledger/stores'
import { deconstructLedgerVerificationProps } from '@core/ledger/helpers'
import { activeProfile, isActiveLedgerProfile } from '@core/profile/stores'
import {
    Event,
    PreparedTransactionEssenceHashProgress,
    TransactionProgress,
    TransactionProgressType,
    TransactionProgressWalletEvent,
    WalletEventType,
} from '@iota/sdk/out/types'
import { get } from 'svelte/store'
import {
    ProfileAuthPopupId,
    closeProfileAuthPopup,
    openProfileAuthPopup,
} from '../../../../../../../desktop/lib/auxiliary/popup'
import { MissingTransactionProgressEventPayloadError } from '../../errors'
import { validateWalletApiEvent } from '../../utils'
import { checkOrConnectLedgerAsync } from '@core/ledger/actions'
import { handleError } from '@core/error/handlers'
import { sendOutput } from '@core/wallet/actions'
import { SupportedNetworkId } from '@core/network/enums'

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
    if (!(type in TransactionProgressType)) {
        throw new MissingTransactionProgressEventPayloadError()
    }

    if (type === TransactionProgressType.PreparedTransaction) {
        openProfileAuthPopup({
            id: ProfileAuthPopupId.VerifyLedgerTransaction,
            hideClose: true,
            preventClose: true,
            props: {
                ...deconstructLedgerVerificationProps(),
            },
        })
    } else if (type === TransactionProgressType.PreparedTransactionEssenceHash) {
        const appName =
            get(activeProfile)?.network?.id === SupportedNetworkId.Iota ? LedgerAppName.Iota : LedgerAppName.Shimmer
        if (get(ledgerDeviceState)?.settings?.[appName]?.blindSigningEnabled) {
            openProfileAuthPopup({
                id: ProfileAuthPopupId.VerifyLedgerTransaction,
                hideClose: true,
                preventClose: true,
                props: {
                    useBlindSigning: true,
                    hash: (progress as PreparedTransactionEssenceHashProgress).hash,
                },
            })
        } else {
            openProfileAuthPopup({
                id: ProfileAuthPopupId.EnableLedgerBlindSigning,
                hideClose: true,
                preventClose: true,
                props: {
                    appName,
                    onEnabled: async () => {
                        try {
                            await checkOrConnectLedgerAsync()
                            if (get(ledgerPreparedOutput)) {
                                await sendOutput(get(ledgerPreparedOutput))
                                resetLedgerPreparedOutput()
                            }
                        } catch (err) {
                            handleError(err)
                        }
                    },
                },
            })
        }
    } else if (type === TransactionProgressType.PerformingPow) {
        closeProfileAuthPopup({ forceClose: true })
    }
}
