import { get } from 'svelte/store'
import { DrawerDirection, DrawerRoute } from '../enums'
import { IDashboardDrawerState } from '../interfaces'
import { drawerState } from '../stores'
import { closeDrawer, openDrawer } from '.'

export function toggleDashboardDrawer({
    id,
    direction = DrawerDirection.Right,
    hideClose = false,
    preventClose = false,
    overflow = false,
}: Omit<IDashboardDrawerState, 'active' | 'route'>): void {
    const $drawerState = get(drawerState)
    if ($drawerState.active && $drawerState.route === DrawerRoute.Dashboard && $drawerState.id === id) {
        closeDrawer()
    } else {
        openDrawer({ route: DrawerRoute.Dashboard, id, hideClose, preventClose, direction, overflow })
    }
}
