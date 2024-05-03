import features from '@features/features'
import { WebPreferences, app } from 'electron'

/**
 * Default web preferences (see https://www.electronjs.org/docs/tutorial/security)
 */
export const DEFAULT_WEB_PREFERENCES: WebPreferences = {
    nodeIntegration: false,
    contextIsolation: true,
    disableBlinkFeatures: 'Auxclick',
    webviewTag: false,
    enableWebSQL: false,
    devTools: !app.isPackaged || features?.electron?.developerTools?.enabled,
}
