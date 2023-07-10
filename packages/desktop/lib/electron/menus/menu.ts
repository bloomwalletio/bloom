import { app, ipcMain, Menu } from 'electron'
import features from '@features/features'
import { closeAboutWindow, getOrInitWindow, openAboutWindow } from '../processes/main.process'
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

function createMenu(): Electron.Menu {
    const template = buildTemplate()
    const applicationMenu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(applicationMenu)

    closeAboutWindow()

    return applicationMenu
}

function handleWindowControls(): void {
    ipcMain.handle('maximize', () => toggleMaximize())
    ipcMain.handle('isMaximized', () => getOrInitWindow('main').isMaximized())
    ipcMain.handle('minimize', () => getOrInitWindow('main').minimize())
    ipcMain.handle('close', () => getOrInitWindow('main').close())
}

function toggleMaximize(): boolean {
    const mainWindow = getOrInitWindow('main')
    const isMaximized = mainWindow.isMaximized()
    isMaximized ? mainWindow.restore() : mainWindow.maximize()
    return !isMaximized
}

export function initMenu(): void {
    let mainMenu = null

    app.once('ready', () => {
        ipcMain.handle('menu-update', (e, args) => {
            state = { ...state, ...args }
            mainMenu = createMenu()
        })

        ipcMain.handle('menu-popup', () => {
            mainMenu.popup(getOrInitWindow('main'))
        })
        ipcMain.handle('menu-data', () => state)
        handleWindowControls()
        mainMenu = createMenu()
    })
}

function commandMenuItem(label: string, command: string, enabled: boolean = true): Electron.MenuItemConstructorOptions {
    return {
        label,
        enabled,
        click: () => getOrInitWindow('main').webContents.send(command),
    }
}

function roleMenuItem(
    label: string,
    role: NonNullable<Electron.MenuItemConstructorOptions['role']>
): Electron.MenuItemConstructorOptions {
    return {
        label,
        role,
    }
}

function buildTemplate(): Electron.MenuItemConstructorOptions[] {
    let firstMenuSubmenu: Electron.MenuItemConstructorOptions[] = getFirstSubmenuItems()

    if (!app.isPackaged || features?.electron?.developerTools?.enabled) {
        firstMenuSubmenu = [...firstMenuSubmenu, roleMenuItem('Developer Tools', 'toggleDevTools')]
    }

    firstMenuSubmenu = [
        ...firstMenuSubmenu,
        commandMenuItem(state.strings.errorLog, 'menu-error-log'),
        { type: 'separator' },
    ]

    if (process.platform === 'darwin') {
        firstMenuSubmenu = [...firstMenuSubmenu, ...getDarwinSubmenuItems(), { type: 'separator' }]
    }

    firstMenuSubmenu = [
        ...firstMenuSubmenu,
        {
            label: state.strings.quit,
            accelerator: process.platform === 'win32' ? 'Alt+F4' : 'CmdOrCtrl+Q',
            click: function (): void {
                app.quit()
            },
        },
    ]

    const firstMenu: Electron.MenuItemConstructorOptions = {
        label: app.name,
        submenu: firstMenuSubmenu,
    }

    const template: Electron.MenuItemConstructorOptions[] = [firstMenu, editMenu]

    if (state.loggedIn) {
        template.push(walletMenu)
    }

    template.push(helpMenu)

    return template
}

function getFirstSubmenuItems(): Electron.MenuItemConstructorOptions[] {
    return [
        {
            label: `${state.strings.about} ${app.name}`,
            click: openAboutWindow,
            enabled: state.enabled,
        },
        commandMenuItem(
            `${state.strings.checkForUpdates}...`,
            'menu-check-for-update',
            app.isPackaged && state.enabled
        ),
        { type: 'separator' },
        commandMenuItem(state.strings.settings, 'menu-navigate-settings'),
        { type: 'separator' },
        commandMenuItem(state.strings.diagnostics, 'menu-diagnostics'),
    ]
}

function getDarwinSubmenuItems(): Electron.MenuItemConstructorOptions[] {
    return [
        roleMenuItem(`${state.strings.hide} ${app.name}`, 'hide'),
        roleMenuItem(state.strings.hideOthers, 'hideothers' as Electron.MenuItemConstructorOptions['role']),
        roleMenuItem(state.strings.showAll, 'unhide'),
    ]
}
