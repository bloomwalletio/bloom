import { get } from 'svelte/store'

import { Platform } from '@core/app/classes'

import { onboardingProfile } from '../stores'

/**
 * Sets the initial storage PIN using the Platform API.
 */
export async function initialisePincodeManager(pinInput: string): Promise<void> {
    const profileId = get(onboardingProfile)?.id
    if (profileId) {
        await Platform.PincodeManager?.set(profileId, pinInput)
    }
}
