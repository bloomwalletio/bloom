import { generateRandomId } from '@core/utils'
import { STRONGHOLD_VERSION } from '@core/stronghold'
import { IOnboardingProfile } from '../interfaces'
import { APP_STAGE, AppStage } from '@core/app'

/**
 * Builds a blank onboarding profile with only an ID and a boolean flag indicating
 * if it is a developer profile.
 */
export function buildInitialOnboardingProfile(): Partial<IOnboardingProfile> {
    const isDeveloperProfile = APP_STAGE !== AppStage.PROD
    return {
        id: generateRandomId(),
        isDeveloperProfile,
        strongholdVersion: STRONGHOLD_VERSION,
    }
}
