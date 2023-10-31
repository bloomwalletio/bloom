import { Platform } from '@core/app/classes'
import { get } from 'svelte/store'
import { profiles } from '../../stores'
import { getStorageDirectoryOfProfiles, removeProfileFolder } from '../../utils'
import { removeAllProfileData } from './removeAllProfileData'

/**
 * Cleanup profile listed that have nothing stored and stored profiles not in app.
 * @method cleanupEmptyProfiles
 * @returns {Promise<void>}
 */
export async function cleanupEmptyProfiles(): Promise<void> {
    try {
        const appDataProfileIds = get(profiles)?.map((_profile) => _profile?.id)
        const profileDataPath = await getStorageDirectoryOfProfiles()
        const storedProfileIds = await Platform.listProfileFolders(profileDataPath)

        const appDataProfileIdsToRemove = appDataProfileIds?.filter(
            (_profileId) => !storedProfileIds.includes(_profileId)
        )
        const storedProfileIdsToRemove = storedProfileIds?.filter(
            (_profileId) => !appDataProfileIds.includes(_profileId)
        )

        for (const profileId of appDataProfileIdsToRemove) {
            removeAllProfileData(profileId)
        }

        for (const profileId of storedProfileIdsToRemove) {
            removeAllProfileData(profileId)
            await removeProfileFolder(profileId)
        }
    } catch (err) {
        // TODO: improve error handling?
        console.error(err)
    }
}
