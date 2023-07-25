import { IProfile } from '@core/profile/interfaces'
import { getActiveProfile } from '@core/profile/stores'

export function doesProfileHaveContacts(profile?: IProfile): boolean {
    const contactMap = profile ? profile.contacts : getActiveProfile().contacts
    return Object.keys(contactMap).length > 0
}
