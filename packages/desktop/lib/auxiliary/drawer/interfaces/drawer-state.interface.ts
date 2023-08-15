import { DrawerDirection, DashboardDrawerRoute } from '../enums'

export interface IDrawerState {
    active: boolean
    id: DashboardDrawerRoute
    hideClose?: boolean
    preventClose?: boolean
    direction?: DrawerDirection
    overflow?: boolean
}
