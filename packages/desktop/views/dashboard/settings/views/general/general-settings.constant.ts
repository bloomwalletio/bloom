import features from '@features/features'
import { CrashReporting, DeepLinks, Language, Notifications, Theme } from '.'
import { GeneralSettingsRoute } from '@core/router'

export const GENERAL_SETTINGS = [
    { ...(features.app.themes.dark.enabled && { component: Theme, childRoute: GeneralSettingsRoute.Theme }) },
    { component: Language, childRoute: GeneralSettingsRoute.Language },
    { component: Notifications, childRoute: GeneralSettingsRoute.Notifications },
    { component: DeepLinks, childRoute: GeneralSettingsRoute.DeepLinks },
    { component: CrashReporting, childRoute: GeneralSettingsRoute.CrashReporting },
]
