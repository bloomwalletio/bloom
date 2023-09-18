import { get } from 'svelte/store'
import { removePersistedShimmerClaimingTransactions } from '@contexts/onboarding/stores'
import {
    removeClaimedActivitiesForProfile,
    removeHiddenActivitiesForProfile,
    removePersistedBalanceChangesForProfile,
    removePersistedEvmTransactionsForProfile,
} from '@core/activity'
import { AppContext } from '@core/app/enums'
import { removePersistedNtsForProfile } from '@core/nfts/stores'
import { removeProfileFolder } from '@core/profile'
import { logout } from '@core/profile/actions'
import { activeProfileId, profiles, removeProfile } from '@core/profile/stores'
import { routerManager } from '@core/router/stores'
import { removePersistedTokensForProfile } from '@core/token/stores'

/**
 * It removes the active profile from the app's list of profiles, removes the profile's directory from
 * the file system, and logs the user out
 * @returns A Promise that resolves to void.
 */
export async function deleteProfile(): Promise<void> {
    try {
        const _activeProfileId = get(activeProfileId)
        if (!_activeProfileId) {
            return
        }

        /**
         * CAUTION: Logout must occur before the profile is removed
         * from the Svelte store list of profiles.
         */
        logout(true, true)

        /**
         * CAUTION: The profile and its data must be removed from the
         * app's list of profiles that lives as a Svelte store.
         */
        removeProfile(_activeProfileId)
        removePersistedEvmTransactionsForProfile(_activeProfileId)
        removePersistedBalanceChangesForProfile(_activeProfileId)
        removeClaimedActivitiesForProfile(_activeProfileId)
        removePersistedNtsForProfile(_activeProfileId)
        removePersistedTokensForProfile(_activeProfileId)
        removePersistedShimmerClaimingTransactions(_activeProfileId)
        removeHiddenActivitiesForProfile(_activeProfileId)

        /**
         * CAUTION: This removes the actual directory for the profile,
         * so it should occur last.
         */
        await removeProfileFolder(_activeProfileId)

        /**
         * NOTE: If there are no more profiles, then the user should be
         * routed to the welcome screen.
         */
        if (get(profiles).length === 0) {
            get(routerManager).goToAppContext(AppContext.Onboarding)
        }
    } catch (err) {
        console.error(err)
    }
}
