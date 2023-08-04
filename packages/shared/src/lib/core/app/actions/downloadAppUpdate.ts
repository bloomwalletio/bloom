import { Platform } from '../classes'
import { resetAppUpdateState } from '../stores'

/**
 * Initializes the download for an application update.
 */
export function downloadAppUpdate(): void {
    resetAppUpdateState()
    void Platform.downloadAppUpdate()
}
