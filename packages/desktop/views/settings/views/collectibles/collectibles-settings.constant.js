import { CollectiblesSettingsRoute } from '@core/router'
import { DownloadNftPermissions, MaxMediaDownloadTime, MaxMediaSize, RefreshNftMedia } from '.'

export const COLLECTIBLES_SETTINGS = [
    {
        component: DownloadNftPermissions,
        childRoute: CollectiblesSettingsRoute.MaxMediaDownloadTime,
    },
    {
        component: MaxMediaDownloadTime,
        childRoute: CollectiblesSettingsRoute.MaxMediaDownloadTime,
    },
    {
        component: MaxMediaSize,
        childRoute: CollectiblesSettingsRoute.MaxMediaSize,
    },
    {
        component: RefreshNftMedia,
        childRoute: CollectiblesSettingsRoute.RefreshNftMedia,
    },
]
