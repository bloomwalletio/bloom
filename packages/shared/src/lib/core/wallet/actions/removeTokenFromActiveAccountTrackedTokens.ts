import { get } from 'svelte/store'
import { selectedAccount } from '@core/account/stores'
import { updateActiveAccount } from '@core/profile/stores'
import { updateActiveAccountPersistedData } from '@core/profile'

export function removeTokenFromActiveAccountTrackedTokens(tokenAddress: string, chainId: number): void {
    const account = get(selectedAccount)
    if (!account) {
        return
    }

    const trackedTokens = account.trackedTokens ?? {}
    trackedTokens[chainId] = trackedTokens[chainId]?.filter(
        (trackedTokenAddress: string) => tokenAddress !== trackedTokenAddress
    )
    updateActiveAccount(account.index, { trackedTokens })
    updateActiveAccountPersistedData(account.index, { trackedTokens })
}
