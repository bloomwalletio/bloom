import { getOrInitWindow } from '../main'
import { MENU_STATE } from './menu-state.constant'

export const walletMenu: Electron.MenuItemConstructorOptions = {
    label: MENU_STATE.strings.wallet,
    submenu: [
        { type: 'separator' },
        {
            label: MENU_STATE.strings.logout,
            click: (): void => getOrInitWindow('main').webContents.send('menu-logout'),
            enabled: MENU_STATE.enabled,
        },
    ],
}
