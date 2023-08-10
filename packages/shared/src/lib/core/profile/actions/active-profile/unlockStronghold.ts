import { IProfile } from '@core/profile'
import { setStrongholdPassword } from '@core/profile-manager'
import { activeProfile, setTimeStrongholdLastUnlocked } from '@core/profile/stores'
import { get } from 'svelte/store'

export async function unlockStronghold(password: string, profile: IProfile = get(activeProfile)): Promise<void> {
    const { isStrongholdLocked } = profile
    if (get(isStrongholdLocked)) {
        try {
            await setStrongholdPassword(password)
            isStrongholdLocked.set(false)
            setTimeStrongholdLastUnlocked()
        } catch (err) {
            console.error(err)
            throw new Error('error.password.incorrect')
        }
    }
}
