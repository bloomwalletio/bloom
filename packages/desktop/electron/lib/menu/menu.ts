import { app, ipcMain, Menu } from 'electron'
import features from '@features/features'
import { closeAboutWindow, getOrInitWindow, openAboutWindow } from '../../main'
import { MENU_STATE } from './menu-state.constant'
import { editMenu } from './edit.menu'
import { helpMenu } from './help.menu'
import { walletMenu } from './wallet.menu'

interface MenuState {
    strings: {
        [key: string]: string
    }
    enabled: boolean
    loggedIn?: boolean
}

let state: MenuState = MENU_STATE

export function initMenu() {
    function createMenu(): Electron.Menu {
        const template = buildTemplate()
        const applicationMenu = Menu.buildFromTemplate(template)
        Menu.setApplicationMenu(applicationMenu)

        closeAboutWindow()

        return applicationMenu
    }

    app.once('ready', () => {
        ipcMain.handle('menu-update', (e, args) => {
            state = { ...state, ...args }
            createMenu()
        })

        ipcMain.handle('menu-popup', () => {
            const mainWindow = getOrInitWindow('main')
            mainWindow.popup()
        })

        ipcMain.handle('menu-data', () => state)

        ipcMain.handle('maximize', () => {
            const mainWindow = getOrInitWindow('main')
            const isMaximized = mainWindow.isMaximized()
            if (isMaximized) {
                mainWindow.restore()
            } else {
                mainWindow.maximize()
            }
            return !isMaximized
        })

        ipcMain.handle('isMaximized', () => getOrInitWindow('main').isMaximized())

        ipcMain.handle('minimize', () => {
            const mainWindow = getOrInitWindow('main')
            mainWindow.minimize()
        })

        ipcMain.handle('close', () => {
            const mainWindow = getOrInitWindow('main')
            mainWindow.close()
        })

        createMenu()
    })
}

/**
 * Builds menu template
 * @returns {Array} Menu template
 */
function buildTemplate(): Electron.MenuItemConstructorOptions[] {
    const template: Electron.MenuItemConstructorOptions[] = [
        {
            label: app.name,
            submenu: [
                {
                    label: `${state.strings.about} ${app.name}`,
                    click: () => openAboutWindow(),
                    enabled: state.enabled,
                },
                {
                    label: `${state.strings.checkForUpdates}...`,
                    click: () => getOrInitWindow('main').webContents.send('menu-check-for-update'),
                    enabled: app.isPackaged ? state.enabled : false,
                },
                { type: 'separator' },

                {
                    label: state.strings.settings,
                    click: () => getOrInitWindow('main').webContents.send('menu-navigate-settings'),
                },
                { type: 'separator' },
                {
                    label: state.strings.diagnostics,
                    click: () => getOrInitWindow('main').webContents.send('menu-diagnostics'),
                },
            ],
        },
    ]

    if (!app.isPackaged || features?.electron?.developerTools?.enabled) {
        template[0].submenu.push({
            label: 'Developer Tools',
            role: 'toggleDevTools',
        })
    }

    template[0].submenu = template[0].submenu.concat([
        {
            label: state.strings.errorLog,
            click: () => getOrInitWindow('main').webContents.send('menu-error-log'),
        },
        { type: 'separator' },
    ])

    if (process.platform === 'darwin') {
        template[0].submenu = template[0].submenu.concat([
            {
                label: `${state.strings.hide} ${app.name}`,
                role: 'hide',
            },
            {
                label: state.strings.hideOthers,
                role: 'hideothers',
            },
            {
                label: state.strings.showAll,
                role: 'unhide',
            },
            { type: 'separator' },
        ])
    }

    template[0].submenu = template[0].submenu.concat([
        {
            label: state.strings.quit,
            accelerator: process.platform === 'win32' ? 'Alt+F4' : 'CmdOrCtrl+Q',
            click: function (): void {
                app.quit()
            },
        },
    ])

    template.push(editMenu)

    if (state.loggedIn) {
        template.push(walletMenu)
    }

    template.push(helpMenu)
    return template
}
