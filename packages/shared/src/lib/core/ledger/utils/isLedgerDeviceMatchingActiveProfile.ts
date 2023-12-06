import { getSelectedAccount } from '@core/account/stores'
import { getProfileManager } from '@core/profile-manager/stores'

import { LedgerAppName } from '../enums'
import { isLedgerAppOpen } from './isLedgerAppOpen'
import { activeProfile } from '@core/profile/stores'
import { get } from 'svelte/store'
import { SupportedNetworkId } from '@core/network'

export async function isLedgerDeviceMatchingActiveProfile(): Promise<boolean | undefined> {
    const appName =
        get(activeProfile)?.network?.id === SupportedNetworkId.Iota ? LedgerAppName.IOTA : LedgerAppName.Shimmer
    if (isLedgerAppOpen(appName)) {
        try {
            const account = getSelectedAccount()
            const cachedAddress = account.depositAddress

            const generatedAddress = await getProfileManager().generateEd25519Address(account.index, 0, {
                internal: false,
                ledgerNanoPrompt: false,
            })

            return cachedAddress === generatedAddress
        } catch (err) {
            return undefined
        }
    } else {
        return undefined
    }
}
