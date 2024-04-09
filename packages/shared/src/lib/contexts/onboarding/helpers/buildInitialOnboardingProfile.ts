import { generateRandomId } from '@core/utils'
import { STRONGHOLD_VERSION } from '@core/stronghold'
import { IOnboardingProfile } from '../interfaces'
import { getRandomAccountColor } from '@core/account/utils'

/**
 * Builds a blank onboarding profile with only an ID and a boolean flag indicating
 * if it is a developer profile.
 */
export function buildInitialOnboardingProfile(): Partial<IOnboardingProfile> {
    return {
        id: generateRandomId(),
        strongholdVersion: STRONGHOLD_VERSION,
        color: getRandomAccountColor(),
    }
}
