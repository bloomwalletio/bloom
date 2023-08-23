import { get } from 'svelte/store'

import { activeAccounts } from '@core/profile/stores'
import { generateAndStoreActivitiesForAccount } from './generateAndStoreActivitiesForAccount'
import { getActiveNetworkId } from '@core/network'
import { localize } from '@core/i18n'

export async function generateAndStoreActivitiesForAllAccounts(): Promise<void> {
    try {
        const networkId = getActiveNetworkId()
        const accounts = get(activeAccounts)

        if (!accounts || !networkId) {
            throw new Error(localize('error.global.accountOrNetworkUndefined'))
        }

        await Promise.all(
            accounts.map((activeAccount) => generateAndStoreActivitiesForAccount(activeAccount, networkId))
        )
    } catch (err) {
        console.error(err)
    }
}
