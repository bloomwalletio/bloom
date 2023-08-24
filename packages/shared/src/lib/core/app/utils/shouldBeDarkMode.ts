import { IS_SYSTEM_IN_DARK_MODE } from '../constants/is-system-in-dark-mode.constant'
import { AppTheme } from '../enums'

/**
 * Returns true if the application should be in dark mode based off of
 * a given theme.
 */
export const shouldBeDarkMode = (theme: AppTheme): boolean => {
    switch (theme) {
        case AppTheme.Light:
            return false
        case AppTheme.Dark:
            return true
        case AppTheme.System:
            return IS_SYSTEM_IN_DARK_MODE
        default:
            return false
    }
}
