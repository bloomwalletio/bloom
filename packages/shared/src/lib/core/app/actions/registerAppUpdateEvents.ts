import { Platform } from '../classes'
import { IAppUpdateDownloadProgress } from '../interfaces'
import { appVersionDetails, updateAppUpdateState } from '../stores'

/**
 * Registers all event handlers for application updates.
 */
export function registerAppUpdateEvents(): void {
    Platform.onEvent('version-details', (nativeVersionDetails) => {
        appVersionDetails.set(nativeVersionDetails)
    })

    Platform.onEvent('version-progress', (appUpdateDownloadProgress: IAppUpdateDownloadProgress) => {
        const bytesRemaining = ((100 - appUpdateDownloadProgress.percent) / 100) * appUpdateDownloadProgress.total
        const minutesRemaining = bytesRemaining / appUpdateDownloadProgress.bytesPerSecond / 60

        updateAppUpdateState({
            busy: true,
            complete: false,
            error: false,
            progress: appUpdateDownloadProgress.percent,
            ...(appUpdateDownloadProgress.bytesPerSecond > 0 && { minutesRemaining: Math.ceil(minutesRemaining) }),
        })
    })

    Platform.onEvent('version-complete', () => {
        updateAppUpdateState({
            busy: false,
            complete: true,
            minutesRemaining: 0,
            progress: 100,
        })
    })

    Platform.onEvent('version-error', (nativeVersionError) => {
        console.error(nativeVersionError)
        updateAppUpdateState({
            busy: false,
            error: true,
        })
    })
}
