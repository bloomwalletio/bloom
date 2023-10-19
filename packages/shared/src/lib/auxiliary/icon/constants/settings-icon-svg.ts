import {
    AdvancedSettingsRoute,
    CollectiblesSettingsRoute,
    GeneralSettingsRoute,
    HelpRoute,
    ProfileSettingsRoute,
    SecuritySettingsRoute,
} from '@core/router'

import { Icon } from '../enums'

export const SETTINGS_ICON_SVG = {
    [GeneralSettingsRoute.Theme]: Icon.Theme,
    [GeneralSettingsRoute.Language]: Icon.Language,
    [GeneralSettingsRoute.Notifications]: Icon.Bell,
    [GeneralSettingsRoute.DeepLinks]: Icon.Link,
    [GeneralSettingsRoute.CrashReporting]: Icon.Doc,
    [ProfileSettingsRoute.ChangeProfileName]: Icon.Profile,
    [ProfileSettingsRoute.Currency]: Icon.Currency,
    [ProfileSettingsRoute.DeleteProfile]: Icon.Delete,
    [CollectiblesSettingsRoute.MaxMediaSize]: Icon.File,
    [CollectiblesSettingsRoute.MaxMediaDownloadTime]: Icon.Timer,
    [CollectiblesSettingsRoute.RefreshNftMedia]: Icon.Refresh,
    [SecuritySettingsRoute.ExportStronghold]: Icon.Export,
    [SecuritySettingsRoute.StrongholdPasswordTimeout]: Icon.Timelock,
    [SecuritySettingsRoute.AppLock]: Icon.Logout,
    [SecuritySettingsRoute.ChangePassword]: Icon.Lock2,
    [SecuritySettingsRoute.ChangePincode]: Icon.Lock,
    [AdvancedSettingsRoute.WalletFinder]: Icon.Reset,
    [AdvancedSettingsRoute.HiddenAccounts]: Icon.View,
    [AdvancedSettingsRoute.DeveloperToggle]: Icon.Dev,
    [HelpRoute.Diagnostics]: Icon.Tools,
    [HelpRoute.ErrorLog]: Icon.Warning,
    [HelpRoute.Documentation]: Icon.Doc,
    [HelpRoute.Faq]: Icon.Speech,
    [HelpRoute.Discord]: Icon.Discord,
    [HelpRoute.ReportAnIssue]: Icon.Help,
}
