import { HiddenAccounts, DeveloperToggle } from '.'
import { AdvancedSettingsRoute } from '@core/router'

export const ADVANCED_SETTINGS = [
    { component: HiddenAccounts, childRoute: AdvancedSettingsRoute.HiddenAccounts, requiresLogin: true },
    { component: DeveloperToggle, childRoute: AdvancedSettingsRoute.DeveloperToggle, requiresLogin: true },
]
