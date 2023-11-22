import { TokenTrackingStatus } from '@core/token/enums'

export function prodProfileMigration0To1(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as { trackedTokens: Record<string, Record<string, TokenTrackingStatus>> }

    Object.keys(profile.trackedTokens).forEach((network) => {
        const oldTrackedTokens = (profile.trackedTokens[network] as unknown as string[]) ?? []
        profile.trackedTokens[network] = Object.fromEntries(
            oldTrackedTokens.map((tokenAddress) => [tokenAddress, TokenTrackingStatus.ManuallyTracked])
        )
    })

    return Promise.resolve()
}
