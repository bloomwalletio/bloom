import { Platform } from '@core/app/classes'
import { IThirdPartyPersistedProfile } from '../interfaces'

export async function getThirdPartyPersistedProfiles(appName: string): Promise<IThirdPartyPersistedProfile[]> {
    let thirdPartyProfiles: IThirdPartyPersistedProfile[] = []
    const thirdPartyData = await Platform.getThirdPartyData(appName)
    if (!thirdPartyData) return []
    const separator = String.fromCharCode(1)
    Object.values(thirdPartyData).forEach(({ key, value }) => {
        if (key.split(separator)[1] === 'profiles') {
            thirdPartyProfiles = JSON.parse(value)
            return
        }
    })
    return thirdPartyProfiles
}
