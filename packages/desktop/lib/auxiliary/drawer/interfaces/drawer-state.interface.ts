import { DrawerDirection, DrawerRoute } from '../enums'
import {
    ContactBookRoute,
    DappConfigRoute,
    DashboardDrawerRoute,
    NetworkConfigRoute,
} from '../../../../views/dashboard/drawers'
import { LoginDrawerRoute } from '../../../../views/login/drawers'

interface IBaseDrawerState {
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
    route: DrawerRoute.Dashboard | DrawerRoute.Login
    id: DashboardDrawerRoute.NetworkConfig | LoginDrawerRoute.NetworkConfig
    initialSubroute?: NetworkConfigRoute
}
