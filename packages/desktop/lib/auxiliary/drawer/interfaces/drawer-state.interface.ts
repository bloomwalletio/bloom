import { DashboardDrawerRoute } from '@views/dashboard/drawers/dashboard-drawer-route.enum'
import { DrawerDirection, DrawerRoute } from '../enums'

export interface IDrawerState {
    active: boolean
    hideClose?: boolean
    preventClose?: boolean
    direction?: DrawerDirection
    overflow?: boolean
}

export interface IDashboardDrawerState extends IDrawerState {
    route: DrawerRoute.Dashboard
    id: DashboardDrawerRoute
    initialSubRoute?: unknown
    props?: Record<string, unknown>
}
