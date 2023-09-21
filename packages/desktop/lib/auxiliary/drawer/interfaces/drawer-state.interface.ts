import { DashboardDrawerRoute } from '@views/dashboard/drawers/dashboard-drawer-route.enum'
import { DrawerDirection, DrawerRoute } from '../enums'
import { ContactBookRoute, DappConfigRoute, NetworkConfigRoute } from '@views/dashboard/drawers'

interface IBaseDrawerState {
    active: boolean
    hideClose?: boolean
    preventClose?: boolean
    direction?: DrawerDirection
    overflow?: boolean
    props?: Record<string, unknown>
}

export interface IContactDrawerState extends IBaseDrawerState {
    route: DrawerRoute.Dashboard
    id: DashboardDrawerRoute.ContactBook
    initialSubroute?: ContactBookRoute
}

export interface IDappConfigDrawerState extends IBaseDrawerState {
    route: DrawerRoute.Dashboard
    id: DashboardDrawerRoute.DappConfig
    initialSubroute?: DappConfigRoute
}

export interface INetworkConfigDrawerState extends IBaseDrawerState {
    route: DrawerRoute.Dashboard
    id: DashboardDrawerRoute.NetworkConfig
    initialSubroute?: NetworkConfigRoute
}
