import { IPersistedProfile } from '@core/profile/interfaces'
import { DEFAULT_PERSISTED_PROFILE_OBJECT } from '@core/profile/constants'

import { IOnboardingProfile } from '../interfaces'
import { DEFAULT_EVM_NETWORK_CONFIGURATIONS_FOR_STARDUST_NETWORK } from '@core/network/constants'

export function convertOnboardingProfileToPersistedProfile(
    onboardingProfile?: Partial<IOnboardingProfile>
): IPersistedProfile {
    const { network } = onboardingProfile ?? {}
    if (!network) {
        throw new Error('Network is undefined!')
    }

    const evmNetworks = DEFAULT_EVM_NETWORK_CONFIGURATIONS_FOR_STARDUST_NETWORK[network.id] ?? []

    return {
        ...structuredClone(DEFAULT_PERSISTED_PROFILE_OBJECT),
        ...{ network },
        ...(evmNetworks && { evmNetworks }),
        ...(onboardingProfile?.name && { name: onboardingProfile.name }),
        ...(onboardingProfile?.id && { id: onboardingProfile.id }),
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
