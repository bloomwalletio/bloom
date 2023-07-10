import { saveActiveProfile } from '@core/profile'
import { getActiveProfile } from '@core/profile/stores'

export function updateActiveProfileTrackedTokens(tokenAddress: string, chainId: number): void {
    const profile = getActiveProfile()
    if (!profile) {
        return
    }

    const trackedTokens = profile.trackedTokens ?? {}
    const chainIdTrackedTokens = trackedTokens[chainId] ?? []
    if (!chainIdTrackedTokens.includes(tokenAddress)) {
        chainIdTrackedTokens.push(tokenAddress)
        profile.trackedTokens = { ...trackedTokens, [chainId]: chainIdTrackedTokens }

        saveActiveProfile()
    }
}
