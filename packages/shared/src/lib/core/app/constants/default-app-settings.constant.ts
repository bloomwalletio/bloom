import { AppTheme } from '../enums'
import { IAppSettings } from '../interfaces'
import { IS_SYSTEM_IN_DARK_MODE } from './is-system-in-dark-mode.constant'

export const DEFAULT_APP_SETTINGS: IAppSettings = {
    deepLinking: false,
    language: 'en',
    theme: AppTheme.System,
    darkMode: IS_SYSTEM_IN_DARK_MODE,
    notifications: true,
    sendCrashReports: true,
}
