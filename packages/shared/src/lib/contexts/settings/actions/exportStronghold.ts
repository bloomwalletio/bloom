import { Platform } from '@core/app/classes'
import { IError } from '@core/error/interfaces'
import { backup } from '@core/profile-manager'
import { updateActiveProfile } from '@core/profile/stores'
import { getDefaultStrongholdName } from '@core/stronghold'

export async function exportStronghold(
    password: string,
    callback?: (cancelled: boolean, error?: string) => void
): Promise<void> {
    try {
        const destination = await Platform.getStrongholdBackupDestination(getDefaultStrongholdName())
        if (destination) {
            await backup(destination, password)
            updateActiveProfile({ lastStrongholdBackupTime: new Date() })
            callback?.(false)
        } else {
            callback?.(true)
        }
    } catch (err) {
        callback?.(false, (err as IError).error)
    }
}
