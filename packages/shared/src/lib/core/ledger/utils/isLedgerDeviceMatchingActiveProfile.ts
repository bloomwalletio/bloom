import { getSelectedAccount } from '@core/account/stores'
import { getProfileManager } from '@core/profile-manager/stores'

import { isLedgerAppOpen } from './isLedgerAppOpen'
import { getProfileLedgerAppName } from '@core/profile/actions/active-profile'

export async function isLedgerDeviceMatchingActiveProfile(): Promise<boolean | undefined> {
    const appName = getProfileLedgerAppName()
    if (isLedgerAppOpen(appName)) {
        try {
            const account = getSelectedAccount()
            const cachedAddress = account.depositAddress

            const generatedAddress = await getProfileManager()?.generateEd25519Address(account.index, 0, {
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
