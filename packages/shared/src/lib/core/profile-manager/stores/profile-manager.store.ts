import { get, writable } from 'svelte/store'
import { IProfileManager } from '../interfaces'

export const profileManager = writable<IProfileManager | null>(null)

export function getProfileManager(): IProfileManager {
    const manager = get(profileManager)
    if (!manager) {
        throw new Error('Profile manager is undefined!')
    }
    return manager
}
