import { DrawerDirection } from '../enums'
import { drawerState } from '../stores'
import { DrawerState } from '../types'

export function openDrawer({
    route,
    id,
    initialSubRoute = undefined,
    direction = DrawerDirection.Right,
    hideClose = false,
    preventClose = false,
    overflow = false,
    props = undefined,
}: Omit<DrawerState, 'active'>): void {
    drawerState.set({ active: true, route, initialSubRoute, id, hideClose, preventClose, direction, overflow, props })
}
