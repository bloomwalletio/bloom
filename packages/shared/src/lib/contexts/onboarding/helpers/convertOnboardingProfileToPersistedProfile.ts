import { IPersistedProfile } from '@core/profile/interfaces'
import { DEFAULT_PERSISTED_PROFILE_OBJECT } from '@core/profile/constants'

import { IOnboardingProfile } from '../interfaces'

export function convertOnboardingProfileToPersistedProfile(
    onboardingProfile?: Partial<IOnboardingProfile>
): IPersistedProfile {
    if (!onboardingProfile?.network) {
        throw new Error('Network is undefined!')
    }
    return {
        ...structuredClone(DEFAULT_PERSISTED_PROFILE_OBJECT),
        ...(onboardingProfile?.id && { id: onboardingProfile.id }),
        ...(onboardingProfile?.name && { name: onboardingProfile.name }),
        ...(onboardingProfile?.network && { network: onboardingProfile.network }),
        ...(onboardingProfile?.type && { type: onboardingProfile.type }),
        ...(onboardingProfile?.lastStrongholdBackupTime && {
            lastStrongholdBackupTime: onboardingProfile.lastStrongholdBackupTime,
        }),
        ...(onboardingProfile?.settings && { settings: onboardingProfile.settings }),
        ...(onboardingProfile?.strongholdVersion && { strongholdVersion: onboardingProfile.strongholdVersion }),
        ...(onboardingProfile?.accountPersistedData && {
            accountPersistedData: onboardingProfile.accountPersistedData,
        }),
        ...(onboardingProfile?.hasVisitedDashboard && { hasVisitedDashboard: onboardingProfile.hasVisitedDashboard }),
        ...(onboardingProfile?.lastUsedAccountIndex && {
            lastUsedAccountIndex: onboardingProfile.lastUsedAccountIndex,
        }),
        ...(onboardingProfile?.clientOptions && { clientOptions: onboardingProfile.clientOptions }),
        ...(onboardingProfile?.color && { color: onboardingProfile.color }),
        ...(onboardingProfile?.version !== undefined && { version: onboardingProfile.version }),
    }
}
