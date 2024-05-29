import { getOrInitWindow } from '../processes/main.process'
import { menuState } from './menu'

export function buildWalletMenu(): Electron.MenuItemConstructorOptions {
    return {
        label: menuState.strings.wallet,
        submenu: [
            { type: 'separator' },
            {
                label: menuState.strings.logout,
                click: (): void => getOrInitWindow('main').webContents.send('menu-logout'),
                enabled: menuState.enabled,
            },
        ],
    }
}
