import { storeMnemonic, verifyMnemonic } from '@core/profile-manager'
import { get } from 'svelte/store'
import { onboardingProfile, updateOnboardingProfile } from '../stores'
import { IS_MOBILE } from '@core/app'

/**
 * Verifies, stores, then clears the mnemonic used in the onboarding flow.
 */
export async function verifyAndStoreMnemonic(): Promise<void> {
    const mnemonic = get(onboardingProfile)?.mnemonic?.join(' ')

    await verifyMnemonic(mnemonic)
    await storeMnemonic(mnemonic)

    if (IS_MOBILE) {
        updateOnboardingProfile({ hasStoredMnemonic: true, mnemonic: null })
    }
}
