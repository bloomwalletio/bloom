import { get } from 'svelte/store'
import { loadAccount } from '@core/account/actions'
import { IAccountState } from '@core/account/interfaces'
import { getAccounts } from '@core/profile-manager/api'
import { activeAccounts, activeProfile } from '../../stores'
import { SupportedNetworkId } from '@core/network'

export async function loadAccounts(): Promise<IAccountState[]> {
    const { hasLoadedAccounts, network } = get(activeProfile)

    const accountsResponse = await getAccounts()
    if (accountsResponse.length === 0) {
        hasLoadedAccounts.set(true)
        return []
    }
    if (accountsResponse) {
        const loadedAccounts = await Promise.all(
            accountsResponse?.map((accountResponse) =>
                loadAccount(accountResponse, network.id !== SupportedNetworkId.Iota)
            )
        )
        activeAccounts.set(loadedAccounts.sort((a, b) => a.getMetadata().index - b.getMetadata().index))
        hasLoadedAccounts.set(true)
    }
    return get(activeAccounts)
}
