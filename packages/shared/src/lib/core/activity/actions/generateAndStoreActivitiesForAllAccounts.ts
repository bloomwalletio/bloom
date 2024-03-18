import { get } from 'svelte/store'

import { activeAccounts, getActiveProfileId } from '@core/profile/stores'
import { generateAndStoreActivitiesForAccount } from './generateAndStoreActivitiesForAccount'
import { getActiveNetworkId } from '@core/network'

export async function generateAndStoreActivitiesForAllAccounts(): Promise<void> {
    try {
        const profileId = getActiveProfileId()
        const networkId = getActiveNetworkId()
        const accounts = get(activeAccounts)

        await Promise.all(
            accounts.map((activeAccount) => generateAndStoreActivitiesForAccount(profileId, activeAccount, networkId))
        )
    } catch (err) {
        console.error(err)
    }
}
