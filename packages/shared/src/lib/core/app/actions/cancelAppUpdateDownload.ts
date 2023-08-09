import { Platform } from '../classes'
import { resetAppUpdateState } from '../stores'

/**
 * Cancels the download of the application update.
 */
export function cancelAppUpdateDownload(): void {
    void Platform.cancelAppUpdateDownload()

    resetAppUpdateState()
}
