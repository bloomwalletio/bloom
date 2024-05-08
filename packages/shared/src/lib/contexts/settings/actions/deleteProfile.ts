import { AppContext } from '@core/app/enums'
import { removeProfileFolder } from '@core/profile'
import { logout, removeAllProfileData } from '@core/profile/actions'
import { profiles } from '@core/profile/stores'
import { routerManager } from '@core/router/stores'
import { get } from 'svelte/store'
import { closePopup } from '../../../../../../desktop/lib/auxiliary/popup'

/**
 * It removes the active profile from the app's list of profiles, removes the profile's directory from
 * the file system, and logs the user out
 * @returns A Promise that resolves to void.
 */
export async function deleteProfile(profileId: string): Promise<void> {
    try {
        /**
         * CAUTION: Logout must occur before the profile is removed
         * from the Svelte store list of profiles.
         */
        logout(true, true)

        /**
         * CAUTION: The profile and its data must be removed from the
         * app's list of profiles that lives as a Svelte store.
         */
        removeAllProfileData(profileId)

        /**
         * CAUTION: This removes the actual directory for the profile,
         * so it should occur last.
         */
        await removeProfileFolder(profileId)

        closePopup()
        /**
         * NOTE: If there are no more profiles, then the user should be
         * routed to the welcome screen.
         */
        if (get(profiles).length === 0) {
            get(routerManager)?.goToAppContext(AppContext.Onboarding)
        }
    } catch (err) {
        console.error(err)
    }
}
