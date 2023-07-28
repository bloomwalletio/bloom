import { AppTheme } from '../enums/app-theme.enum'
import { IAppSettings } from '../interfaces'
import { shouldBeDarkMode } from '../utils/shouldBeDarkMode'

export const DEFAULT_APP_SETTINGS: IAppSettings = {
    deepLinking: false,
    language: 'en',
    theme: AppTheme.System,
    darkMode: shouldBeDarkMode(AppTheme.System),
    notifications: true,
    sendCrashReports: true,
}
