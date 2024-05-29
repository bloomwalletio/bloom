import { menuState } from './menu'

interface MenuItem extends Electron.MenuItemConstructorOptions {
    selector: string
}

const menuItem = (
    role: NonNullable<Electron.MenuItemConstructorOptions['role']>,
    accelerator: Electron.MenuItemConstructorOptions['accelerator']
): MenuItem => ({
    label: menuState.strings[role],
    accelerator,
    selector: `${role}:`,
})

export function buildEditMenu(): Electron.MenuItemConstructorOptions {
    return {
        label: menuState.strings.edit,
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
}
