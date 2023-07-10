import { MENU_STATE } from './menu-state.constant'

interface MenuItem extends Electron.MenuItemConstructorOptions {
    selector: string
}

const menuItem = (
    role: NonNullable<Electron.MenuItemConstructorOptions['role']>,
    accelerator: Electron.MenuItemConstructorOptions['accelerator']
): MenuItem => ({
    label: MENU_STATE.strings[role],
    accelerator,
    selector: `${role}:`,
})

export const editMenu: Electron.MenuItemConstructorOptions = {
    label: MENU_STATE.strings.edit,
    submenu: [
        menuItem('undo', 'CmdOrCtrl+Z'),
        menuItem('redo', 'Shift+CmdOrCtrl+Z'),
        { type: 'separator' },
        menuItem('cut', 'CmdOrCtrl+X'),
        menuItem('copy', 'CmdOrCtrl+C'),
        menuItem('paste', 'CmdOrCtrl+V'),
        menuItem('selectAll', 'CmdOrCtrl+A'),
    ],
}
