import { app, ipcMain, Menu } from 'electron'
import features from '@features/features'
import { getOrInitWindow } from '../processes/main.process'
import { MENU_STATE } from './menu-state.constant'
import { buildEditMenu } from './edit.menu'
import { buildHelpMenu } from './help.menu'
import { buildWalletMenu } from './wallet.menu'
import { AboutWindow } from '../windows/about.window'

interface MenuState {
    strings: {
        [key: string]: string
    }
    enabled: boolean
    loggedIn?: boolean
}

export let menuState: MenuState = MENU_STATE

function createMenu(): Electron.Menu {
    const template = buildTemplate()
    const applicationMenu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(applicationMenu)

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
    let mainMenu: Electron.Menu

    app.once('ready', () => {
        ipcMain.handle('menu-update', (e, args) => {
            menuState = { ...menuState, ...args }
            mainMenu = createMenu()
        })

        ipcMain.handle('menu-popup', () => {
            mainMenu.popup({ window: getOrInitWindow('main') })
        })
        ipcMain.handle('menu-data', () => menuState)
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
        firstMenuSubmenu = [...firstMenuSubmenu, roleMenuItem(menuState.strings.developerTools, 'toggleDevTools')]
    }

    firstMenuSubmenu = [
        ...firstMenuSubmenu,
        commandMenuItem(menuState.strings.errorLog, 'menu-error-log'),
        { type: 'separator' },
    ]

    if (process.platform === 'darwin') {
        firstMenuSubmenu = [...firstMenuSubmenu, ...getDarwinSubmenuItems(), { type: 'separator' }]
    }

    firstMenuSubmenu = [
        ...firstMenuSubmenu,
        {
            label: menuState.strings.quit,
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

    const template: Electron.MenuItemConstructorOptions[] = [firstMenu, buildEditMenu()]

    // TODO: this doesn't work because the state is not updated when the user logs in
    if (menuState.loggedIn) {
        template.push(buildWalletMenu())
    }

    template.push(buildHelpMenu())

    return template
}

function getFirstSubmenuItems(): Electron.MenuItemConstructorOptions[] {
    let menuItems: Electron.MenuItemConstructorOptions[] = [
        {
            label: `${menuState.strings.about} ${app.name}`,
            click: AboutWindow.open,
            enabled: menuState.enabled,
        },
        commandMenuItem(
            `${menuState.strings.checkForUpdates}...`,
            'menu-check-for-update',
            app.isPackaged && menuState.enabled
        ),
    ]
    if (features?.electron?.importFromThirdParty?.enabled) {
        menuItems.push(commandMenuItem(menuState.strings.importThirdPartyProfiles, 'import-third-party-profile'))
    }
    menuItems = [
        ...menuItems,
        { type: 'separator' },
        commandMenuItem(menuState.strings.settings, 'menu-navigate-settings'),
        { type: 'separator' },
        commandMenuItem(menuState.strings.diagnostics, 'menu-diagnostics'),
    ]
    return menuItems
}

function getDarwinSubmenuItems(): Electron.MenuItemConstructorOptions[] {
    return [
        roleMenuItem(`${menuState.strings.hide} ${app.name}`, 'hide'),
        roleMenuItem(menuState.strings.hideOthers, 'hideOthers'),
        roleMenuItem(menuState.strings.showAll, 'unhide'),
    ]
}
