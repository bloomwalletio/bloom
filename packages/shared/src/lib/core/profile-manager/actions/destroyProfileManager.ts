import { get, Writable } from 'svelte/store'

import { api } from '../api'
import { IProfileManager } from '../interfaces'
import { profileManager } from '../stores'

export async function destroyProfileManager(
    _profileManager: Writable<IProfileManager | undefined> = profileManager
): Promise<void> {
    const manager = get(_profileManager)
    if (!manager) {
        return
    }

    _profileManager.set(undefined)
    api.deleteWallet(manager?.id)
    await manager.destroy()
}
