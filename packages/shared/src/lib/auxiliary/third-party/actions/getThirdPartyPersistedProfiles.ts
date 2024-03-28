import { Platform } from '@core/app/classes'
import { IThirdPartyPersistedProfile } from '../interfaces'
import { ThirdPartyAppName } from '../enums'

export async function getThirdPartyPersistedProfiles(
    appName: ThirdPartyAppName
): Promise<IThirdPartyPersistedProfile[]> {
    try {
        const thirdPartyData = await Platform.getThirdPartyData(appName)
        if (!thirdPartyData) return Promise.reject()

        let thirdPartyProfiles: IThirdPartyPersistedProfile[] = []
        const separator = String.fromCharCode(1)
        Object.values(thirdPartyData).forEach(({ key, value }) => {
            if (key.split(separator)[1] === 'profiles') {
                thirdPartyProfiles = JSON.parse(value)
                return
            }
        })
        return thirdPartyProfiles.length ? Promise.resolve(thirdPartyProfiles) : Promise.reject()
    } catch (error) {
        return Promise.reject(error)
    }
}
