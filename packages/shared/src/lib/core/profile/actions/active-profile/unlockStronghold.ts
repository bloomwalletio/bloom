import { ErrorType, WalletError } from '@core/error'
import { parseError } from '@core/error/utils/parsers/parseError'
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
            const error = parseError(err)
            if (!(error.type === ErrorType.Wallet && error.error === WalletError.IncorrectPassword)) {
                error.notify()
                error.save()
            }
            throw error
        }
    }
}
