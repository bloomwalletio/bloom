import { get } from 'svelte/store'

import { Platform } from '@core/app/classes'
import { InvalidBackupDestinationError } from '@core/profile/errors'
import { backup } from '@core/profile-manager'
import { getDefaultStrongholdName } from '@core/stronghold'

import { onboardingProfile, updateOnboardingProfile } from '../stores'

/**
 * Creates an initial backup for a profile's Stronghold.
 */
export async function backupInitialStronghold(): Promise<void> {
    const $onboardingProfile = get(onboardingProfile)
    const strongholdBackupDestination = await Platform.getStrongholdBackupDestination(
        getDefaultStrongholdName($onboardingProfile?.name)
    )
    const password = $onboardingProfile?.strongholdPassword
    if (strongholdBackupDestination && password) {
        await backup(strongholdBackupDestination, password)
        updateOnboardingProfile({ lastStrongholdBackupTime: new Date() })
    } else {
        throw new InvalidBackupDestinationError()
    }
}
