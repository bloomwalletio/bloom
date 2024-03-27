import { HiddenAccounts, ToggleFeatures } from '.'
import { AdvancedSettingsRoute } from '@core/router'

export const ADVANCED_SETTINGS = [
    { component: ToggleFeatures, childRoute: AdvancedSettingsRoute.ToggleFeatures, requiresLogin: true },
    { component: HiddenAccounts, childRoute: AdvancedSettingsRoute.HiddenAccounts, requiresLogin: true },
]
