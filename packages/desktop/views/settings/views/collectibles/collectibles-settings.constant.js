import { CollectiblesSettingsRoute } from '@core/router'
import { IpfsGateways, DownloadNftPermissions, MaxMediaDownloadTime, MaxMediaSize, RefreshNftMedia } from '.'

export const COLLECTIBLES_SETTINGS = [
    {
        component: DownloadNftPermissions,
        childRoute: CollectiblesSettingsRoute.MaxMediaDownloadTime,
    },
    {
        component: IpfsGateways,
        childRoute: CollectiblesSettingsRoute.IpfsGateways,
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
