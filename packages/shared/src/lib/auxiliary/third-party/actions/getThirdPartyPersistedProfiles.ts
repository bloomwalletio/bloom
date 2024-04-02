import { Platform } from '@core/app/classes'
import { IThirdPartyPersistedProfile } from '../interfaces'
import { ThirdPartyAppName } from '../enums'
import { migrateThirdPartyPersistedProfiles } from '../migrations/actions/migrateThirdPartyPeristedProfiles'

export async function getThirdPartyPersistedProfiles(
    appName: ThirdPartyAppName
): Promise<IThirdPartyPersistedProfile[]> {
    try {
        let profileVersion = 0
        const thirdPartyData = await Platform.getThirdPartyData(appName)
        if (!thirdPartyData) return Promise.reject()

        let thirdPartyProfiles: IThirdPartyPersistedProfile[] = []
        const separator = String.fromCharCode(1)
        console.log(thirdPartyData)
        Object.values(thirdPartyData).forEach(({ key, value }) => {
            if (key.split(separator)[1] === 'profiles') {
                thirdPartyProfiles = JSON.parse(value)
                return
            } else if (key.split(separator)[1] === 'currentProfileVersion'){
                profileVersion = parseInt(value)
            }
        })
        if (thirdPartyProfiles.length > 0) {
            return migrateThirdPartyPersistedProfiles(thirdPartyProfiles, appName, profileVersion)
        } else {
            return Promise.reject()
        }
    } catch (error) {
        return Promise.reject(error)
    }
}
