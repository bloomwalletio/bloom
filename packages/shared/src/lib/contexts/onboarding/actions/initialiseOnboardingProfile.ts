import { get } from 'svelte/store'
import { stopPollingLedgerDeviceState } from '@core/ledger'
import { destroyProfileManager, profileManager } from '@core/profile-manager'
import { waitForPreviousManagerToBeDestroyed } from '@core/profile/utils'
import { buildInitialOnboardingProfile } from '../helpers'
import { isOnboardingLedgerProfile, onboardingProfile } from '../stores'

/**
 * Builds a new onboarding profile and sets the Svelte store accordingly.
 */
export async function initialiseOnboardingProfile(): Promise<void> {
    await waitForPreviousManagerToBeDestroyed()

    if (get(profileManager)) {
        if (get(isOnboardingLedgerProfile)) {
            stopPollingLedgerDeviceState()
        }
        await destroyProfileManager()
    }

    const _newProfile = buildInitialOnboardingProfile()
    onboardingProfile.set(_newProfile)
}
