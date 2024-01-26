import { get, writable } from 'svelte/store'
import { IProfileManager } from '../interfaces'

export const profileManager = writable<IProfileManager | null>(null)

export function getProfileManager(): IProfileManager | null {
    const manager = get(profileManager)
    return manager
}
