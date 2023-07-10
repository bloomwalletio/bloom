import { saveActiveProfile } from '@core/profile'
import { getActiveProfile } from '@core/profile/stores'

import { buildPersistedAssetFromMetadata } from '../helpers'
import type { IErc20Metadata } from '../interfaces'
import { updatePersistedAsset } from '../stores'

export function updateActiveProfileTrackedTokens(
    chainId: number,
    tokenAddress: string,
    tokenMetadata: IErc20Metadata
): void {
    const profile = getActiveProfile()
    if (!profile) {
        return
    }

    const trackedTokens = profile.trackedTokens ?? {}
    const chainIdTrackedTokens = trackedTokens[chainId] ?? []
    if (!chainIdTrackedTokens.includes(tokenAddress)) {
        chainIdTrackedTokens.push(tokenAddress)
        profile.trackedTokens = { ...trackedTokens, [chainId]: chainIdTrackedTokens }
        updatePersistedAsset(buildPersistedAssetFromMetadata(tokenAddress, tokenMetadata))

        saveActiveProfile()
    }
}
