import { get } from 'svelte/store'

import { selectedAccount } from '@core/account/stores'
import { updateActiveAccountPersistedData } from '@core/profile/actions'
import { updateActiveAccount } from '@core/profile/stores'

import { buildPersistedAssetFromMetadata } from '../helpers'
import { IErc20Metadata } from '../interfaces'
import { updatePersistedAsset } from '../stores'

export function updateActiveAccountTrackedTokens(
    chainId: number,
    tokenAddress: string,
    tokenMetadata: IErc20Metadata
): void {
    const account = get(selectedAccount)
    if (!account) {
        return
    }

    let trackedTokens = account.trackedTokens ?? {}
    const chainIdTrackedTokens = trackedTokens[chainId] ?? []
    if (!chainIdTrackedTokens.includes(tokenAddress)) {
        chainIdTrackedTokens.push(tokenAddress)
        trackedTokens = { ...trackedTokens, [chainId]: chainIdTrackedTokens }

        updateActiveAccount(account.index, { trackedTokens })
        updateActiveAccountPersistedData(account.index, { trackedTokens })
        updatePersistedAsset(buildPersistedAssetFromMetadata(tokenAddress, tokenMetadata))
    }
}
