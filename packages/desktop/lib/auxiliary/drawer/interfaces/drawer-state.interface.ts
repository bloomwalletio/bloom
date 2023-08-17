import { DashboardDrawerRoute } from '@views/dashboard/drawers'
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
}
