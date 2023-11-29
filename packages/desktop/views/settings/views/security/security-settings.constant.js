import { AutoLogout, ChangePassword, ChangePincode, ExportStronghold, StrongholdTimeout } from './'
import { SecuritySettingsRoute } from '@core/router'

export const SECURITY_SETTINGS = [
    { component: AutoLogout, childRoute: SecuritySettingsRoute.AutoLogout },
    {
        component: StrongholdTimeout,
        childRoute: SecuritySettingsRoute.StrongholdTimeout,
        requiresSoftwareProfile: true,
    },
    { component: ChangePincode, childRoute: SecuritySettingsRoute.ChangePincode },
    { component: ChangePassword, childRoute: SecuritySettingsRoute.ChangePassword, requiresSoftwareProfile: true },
    { component: ExportStronghold, childRoute: SecuritySettingsRoute.ExportStronghold, requiresSoftwareProfile: true },
]
