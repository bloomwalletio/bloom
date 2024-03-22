import { get } from 'svelte/store'

import {
    buildProfileManagerOptionsFromProfileData,
    initialiseProfileManager,
    profileManager,
} from '@core/profile-manager'

import { onboardingProfile, updateOnboardingProfile } from '../stores'
import { removeProfileFolder } from '@core/profile'

export async function initialiseProfileManagerFromOnboardingProfile(checkForExistingManager?: boolean): Promise<void> {
    const existingManager = get(profileManager)
    if (existingManager) {
        if (!checkForExistingManager) {
            await existingManager.destroy()
            removeProfileFolder(existingManager.id)
        } else {
            return
        }
    }

    const profile = get(onboardingProfile) ?? {}
    const profileManagerOptions = await buildProfileManagerOptionsFromProfileData(profile)
    const { storagePath, coinType, clientOptions, secretManager } = profileManagerOptions
    const manager = await initialiseProfileManager(storagePath, coinType, clientOptions, secretManager, profile.id)
    profileManager.set(manager)
    updateOnboardingProfile({ hasInitialisedProfileManager: true })
}
