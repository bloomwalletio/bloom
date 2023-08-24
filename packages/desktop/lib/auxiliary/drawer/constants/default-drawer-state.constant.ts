import { DashboardDrawerRoute } from '@views/dashboard/drawers'
import { DrawerRoute } from '../enums'
import { DrawerState } from '../types'

export const DEFAULT_DRAWER_STATE: DrawerState = {
    route: DrawerRoute.Dashboard,
    id: DashboardDrawerRoute.NetworkConfig,
    active: false,
    hideClose: false,
    preventClose: false,
    direction: null,
    overflow: false,
}
