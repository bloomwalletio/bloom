import { get } from 'svelte/store'
import { closeDrawer, openDrawer } from '.'
import { DrawerDirection, DrawerRoute } from '../enums'
import { drawerState } from '../stores'
import { DrawerState } from '@desktop/auxiliary/drawer/types'

export function toggleDashboardDrawer({
    id,
    initialSubroute = undefined,
    direction = DrawerDirection.Right,
    hideClose = false,
    preventClose = false,
    overflow = false,
    props = undefined,
}: Omit<DrawerState, 'active' | 'route'>): void {
    const $drawerState = get(drawerState)
    if ($drawerState?.active && $drawerState.route === DrawerRoute.Dashboard && $drawerState.id === id) {
        closeDrawer()
    } else {
        openDrawer({
            route: DrawerRoute.Dashboard,
            id,
            initialSubroute,
            hideClose,
            preventClose,
            direction,
            overflow,
            props,
        })
    }
}
