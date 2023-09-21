import { DrawerDirection } from '../enums'
import { drawerState } from '../stores'
import { DrawerState } from '../types'

export function openDrawer({
    route,
    id,
    initialSubroute = undefined,
    direction = DrawerDirection.Right,
    hideClose = false,
    preventClose = false,
    overflow = false,
    props = undefined,
}: Omit<DrawerState, 'active'>): void {
    drawerState.set({
        active: true,
        route,
        initialSubroute,
        id,
        hideClose,
        preventClose,
        direction,
        overflow,
        props,
    } as DrawerState)
}
