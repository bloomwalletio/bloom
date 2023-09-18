import { get } from 'svelte/store'
import { activeProfile } from '@core/profile/stores'
import { clearStrongholdPassword } from '@core/profile-manager'
import { reflectLockedStronghold } from './reflectLockedStronghold'

export async function lockStronghold(): Promise<void> {
    const { isStrongholdLocked } = get(activeProfile)
    if (!get(isStrongholdLocked)) {
        await clearStrongholdPassword()
        reflectLockedStronghold()
    }
}
