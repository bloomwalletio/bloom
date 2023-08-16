import { writable } from 'svelte/store'
import type { IProfile } from '../interfaces/profile.interface'

export const INITIAL_ACTIVE_PROFILE: Partial<IProfile> = {
    hasLoadedAccounts: writable<boolean>(false),
    isStrongholdLocked: writable<boolean>(true),
    shouldOpenProfileModal: writable<boolean>(false),
    loggedIn: writable<boolean>(false),
    lastActiveAt: writable<Date>(new Date()),
    contacts: {},
    networkContactAddresses: {},
    internalTransfersInProgress: writable<{
        [key: string]: {
            from: string
            to: string
        }
    }>({}),
    showHiddenAccounts: false,
}
