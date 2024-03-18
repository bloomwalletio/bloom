import { get, writable } from 'svelte/store'
import { IProfileManager } from '../interfaces'

export const profileManager = writable<IProfileManager>(undefined)

export function getProfileManager(): IProfileManager | undefined {
    const manager = get(profileManager)
    return manager
}
