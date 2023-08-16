import { DrawerDirection } from '../enums'
import { drawerState } from '../stores'
import { DrawerState } from '../types'

export function openDrawer({
    route,
    id,
    direction = DrawerDirection.Right,
    hideClose = false,
    preventClose = false,
    overflow = false,
}: Omit<DrawerState, 'active'>): void {
    drawerState.set({ active: true, route, id, hideClose, preventClose, direction, overflow })
}
