import { Menu, MenuItemConstructorOptions } from 'electron'
import { MENU_STATE } from './menu-state.constant'

const menuItem = (role: NonNullable<Electron.MenuItem['role']>): MenuItemConstructorOptions => ({
    label: MENU_STATE.strings[role],
    role,
})

export function contextMenu(): Electron.Menu {
    return Menu.buildFromTemplate([
        menuItem('undo'),
        menuItem('redo'),
        { type: 'separator' },
        menuItem('cut'),
        menuItem('copy'),
        menuItem('paste'),
        { type: 'separator' },
        menuItem('selectAll'),
    ])
}
