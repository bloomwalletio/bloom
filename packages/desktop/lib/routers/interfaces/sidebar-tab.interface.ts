import { IconName } from '@bloomwalletio/ui'
import { DashboardRoute } from '@core/router'
import { NotificationVariant } from '@auxiliary/notification'

export interface ISidebarTab {
    icon: IconName
    label: string
    route: DashboardRoute
    onClick: () => void
    notificationType?: NotificationVariant
}
