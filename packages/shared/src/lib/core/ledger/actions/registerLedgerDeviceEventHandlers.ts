import { get } from 'svelte/store'

import { deconstructBip32Path } from '@core/account/utils'
import { Platform } from '@core/app/classes'
import { addError } from '@core/error/stores'
import { updateActiveAccountPersistedData } from '@core/profile/actions'
import { activeAccounts, updateActiveAccount } from '@core/profile/stores'

export function registerLedgerDeviceEventHandlers(): void {
    Platform.onEvent('ledger-error', (error) => {
        addError(error)
    })

    Platform.onEvent('evm-address', ({ evmAddress, bip32Path }) => {
        console.log('got evm address: ', evmAddress, bip32Path)
        const { coinType, accountIndex } = deconstructBip32Path(bip32Path)
        if (coinType === undefined || !evmAddress || accountIndex === undefined) {
            return
        }

        const evmAddresses = get(activeAccounts)?.[accountIndex]?.evmAddresses ?? {}
        evmAddresses[coinType] = evmAddress

        updateActiveAccount(accountIndex, { evmAddresses })
        updateActiveAccountPersistedData(accountIndex, { evmAddresses })
    })
}
