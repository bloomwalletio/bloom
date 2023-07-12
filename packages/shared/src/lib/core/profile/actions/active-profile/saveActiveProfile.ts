import { activeProfile, IPersistedProfile, saveProfile } from '@core/profile'
import { get } from 'svelte/store'

export function saveActiveProfile(): void {
    const _activeProfile = get(activeProfile)
    if (_activeProfile?.id) {
        // activeProfile contains more properties that IPersistedProfile
        // so we need to destructure only the properties that we want to persist
        const profileToPersist: IPersistedProfile = {
            id: _activeProfile.id,
            name: _activeProfile.name,
            type: _activeProfile.type,
            network: _activeProfile.network,
            contacts: _activeProfile.contacts,
            networkContactAddresses: _activeProfile.networkContactAddresses,
            lastStrongholdBackupTime: _activeProfile.lastStrongholdBackupTime,
            settings: _activeProfile.settings,
            isDeveloperProfile: _activeProfile.isDeveloperProfile,
            clientOptions: _activeProfile.clientOptions,
            forceAssetRefresh: _activeProfile.forceAssetRefresh,
            strongholdVersion: _activeProfile.strongholdVersion,
            trackedTokens: _activeProfile.trackedTokens,
            ...(_activeProfile.hasVisitedDashboard && { hasVisitedDashboard: _activeProfile.hasVisitedDashboard }),
            ...(_activeProfile.lastUsedAccountIndex && { lastUsedAccountIndex: _activeProfile.lastUsedAccountIndex }),
            ...(_activeProfile.accountPersistedData && { accountPersistedData: _activeProfile.accountPersistedData }),
            ...(_activeProfile.pfp && { pfp: _activeProfile.pfp }),
        }
        saveProfile(profileToPersist)
    }
}
