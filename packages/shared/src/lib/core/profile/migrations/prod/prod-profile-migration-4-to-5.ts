import { IPersistedProfile } from '@core/profile/interfaces'
import { checkAndMigrateOldLocalEvmTransactions } from '../actions/checkAndMigrateOldLocalEvmTransactions'

export async function prodProfileMigration4To5(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as IPersistedProfile

    const defaultFeatures = {
        wallet: true,
        collectibles: true,
        campaigns: true,
        governance: true,
        buySell: true,
        // @ts-expect-error isDeveloperProfile was removed in favor of the feature flag, but it exists on old profiles
        developer: profile.isDeveloperProfile,
        settings: true,
    }

    profile.features = {
        ...defaultFeatures,
        ...profile.features,
    }

    try {
        await checkAndMigrateOldLocalEvmTransactions(profile)
    } catch (error) {
        return Promise.reject()
    }

    return Promise.resolve()
}
