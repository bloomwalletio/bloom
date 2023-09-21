import { DashboardDrawerRoute } from '@views/dashboard/drawers/dashboard-drawer-route.enum'
import { DrawerDirection, DrawerRoute } from '../enums'
import { ContactBookRoute, DappConfigRoute, NetworkConfigRoute } from '@views/dashboard/drawers'

export interface IDrawerState {
    active: boolean
    hideClose?: boolean
    preventClose?: boolean
    direction?: DrawerDirection
    overflow?: boolean
}

export interface IContactDrawerState extends IDrawerState {
    route: DrawerRoute.Dashboard
    id: DashboardDrawerRoute.ContactBook
    initialSubRoute?: ContactBookRoute
    props?: Record<string, unknown>
}

export interface IDappConfigDrawerState extends IDrawerState {
    route: DrawerRoute.Dashboard
    id: DashboardDrawerRoute.DappConfig
    initialSubRoute?: DappConfigRoute
    props?: Record<string, unknown>
}

export interface INetworkConfigDrawerState extends IDrawerState {
    route: DrawerRoute.Dashboard
    id: DashboardDrawerRoute.NetworkConfig
    initialSubRoute?: NetworkConfigRoute
    props?: Record<string, unknown>
}
