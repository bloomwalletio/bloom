import { DashboardRoute } from '@core/router'
import { NotificationVariant } from '@auxiliary/notification'

export interface ISidebarTab {
    icon: string
    label: string
    route: DashboardRoute
    onClick: () => void
    notificationType?: NotificationVariant
}
