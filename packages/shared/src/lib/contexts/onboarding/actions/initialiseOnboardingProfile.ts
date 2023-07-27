import { get } from 'svelte/store'
import { stopPollingLedgerNanoStatus } from '@core/ledger'
import { destroyProfileManager, profileManager } from '@core/profile-manager'
import { waitForPreviousManagerToBeDestroyed } from '@core/profile/utils'
import { OnboardingProfileManagerAlreadyInitializedError } from '../errors'
import { buildInitialOnboardingProfile } from '../helpers'
import { isOnboardingLedgerProfile, onboardingProfile } from '../stores'

/**
 * Builds a new onboarding profile and sets the Svelte store accordingly.
 */
export async function initialiseOnboardingProfile(destroyPreviousManager = false): Promise<void> {
    await waitForPreviousManagerToBeDestroyed()
    if (get(profileManager)) {
        if (destroyPreviousManager) {
            if (get(isOnboardingLedgerProfile)) {
                stopPollingLedgerNanoStatus()
            }
            await destroyProfileManager()
        } else {
            throw new OnboardingProfileManagerAlreadyInitializedError()
        }
    }

    const _newProfile = buildInitialOnboardingProfile()
    onboardingProfile.set(_newProfile)
}
