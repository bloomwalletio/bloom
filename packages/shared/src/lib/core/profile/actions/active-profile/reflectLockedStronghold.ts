import { get } from 'svelte/store'
import { activeProfile, clearTimeStrongholdLastUnlocked } from '@core/profile/stores'

export function reflectLockedStronghold(): void {
    const { isStrongholdLocked } = get(activeProfile)
    isStrongholdLocked?.set(true)
    clearTimeStrongholdLastUnlocked()
}
