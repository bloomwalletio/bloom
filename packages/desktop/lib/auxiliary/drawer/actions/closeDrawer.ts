import { drawerState } from '../stores'

export function closeDrawer(): void {
    drawerState.set(undefined)
}
