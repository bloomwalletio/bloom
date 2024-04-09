import { get } from 'svelte/store'
import { handleLedgerError } from '@core/ledger/utils'
import { ProfileType } from '@core/profile/enums'
import { activeProfile } from '@core/profile/stores'
import { WalletRsError } from '../enums'

import { handleGenericError } from './handleGenericError'
import { handleWalletRsError } from './walletRs'
import { IError } from '../interfaces'

export function handleError(err: unknown, resetConfirmationPropsOnDenial = true): void {
    const error = err as IError
    const _activeProfile = get(activeProfile)
    if (Object.values(WalletRsError).includes(error?.type as WalletRsError)) {
        handleWalletRsError(error, resetConfirmationPropsOnDenial)
    } else if (_activeProfile.type === ProfileType.Ledger) {
        handleLedgerError(error, resetConfirmationPropsOnDenial)
    } else {
        handleGenericError(error)
    }
}
