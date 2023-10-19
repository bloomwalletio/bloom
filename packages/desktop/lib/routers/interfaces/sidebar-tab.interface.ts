import { IconName } from '@bloomwalletio/ui'
import { DashboardRoute, SettingsRoute, SettingsRouteNoProfile } from '@core/router/enums'
import { NotificationVariant } from '@auxiliary/notification'

interface IBaseSidebarTab {
    icon: IconName
    label: string
    onClick: () => void
    notificationType?: NotificationVariant
}

export interface IDashboardSidebarTab extends IBaseSidebarTab {
    route: DashboardRoute
}

export interface ISettingsSidebarTab extends IBaseSidebarTab {
    route: SettingsRoute | SettingsRouteNoProfile
}
