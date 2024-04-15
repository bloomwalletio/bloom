import { writable } from 'svelte/store'
import { IThirdPartyProfileStoreItem } from '../interfaces'

export type ThirdPartyProfileStore = {
    [profileId: string]: IThirdPartyProfileStoreItem
}

export const thirdPartyProfiles = writable<ThirdPartyProfileStore | undefined>(undefined)
