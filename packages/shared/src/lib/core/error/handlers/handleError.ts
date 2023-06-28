import { get } from 'svelte/store'
import { handleLedgerError } from '@core/ledger/utils'
import { ProfileType } from '@core/profile/enums'
import { activeProfile } from '@core/profile/stores'
import { WalletRsError } from '../enums'

import { handleGenericError } from './handleGenericError'
import { handleWalletRsError } from './walletRs'

export function handleError(err: unknown, resetConfirmationPropsOnDenial = true): void {
    const _activeProfile = get(activeProfile)
    if (
        err &&
        typeof err === 'object' &&
        'type' in err &&
        Object.values(WalletRsError).includes(err?.type as WalletRsError)
    ) {
        handleWalletRsError(err, resetConfirmationPropsOnDenial)
    } else if (_activeProfile.type === ProfileType.Ledger) {
        handleLedgerError(err, resetConfirmationPropsOnDenial)
    } else {
        handleGenericError(err)
    }
}
