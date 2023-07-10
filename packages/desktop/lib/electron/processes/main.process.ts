// Modules to control application life and create native browser window
import {
    app,
    dialog,
    ipcMain,
    protocol,
    shell,
    BrowserWindow,
    session,
    utilityProcess,
    nativeTheme,
    PopupOptions,
} from 'electron'
import { WebPreferences } from 'electron/main'
import path from 'path'
import fs from 'fs'

import features from '@features/features'

import AnalyticsManager from '../managers/analytics.manager'
import AutoUpdateManager from '../managers/auto-update.manager'
import KeychainManager from '../managers/keychain.manager'
import NftDownloadManager from '../managers/nft-download.manager'
import { contextMenu } from '../menus/context.menu'
import { initMenu } from '../menus/menu'
import { getDiagnostics } from '../utils/diagnostics.utils'
import { shouldReportError } from '../utils/error.utils'
import { getMachineId } from '../utils/os.utils'
import { LedgerMethod } from '../enums/ledger-method.enum'
import type { ILedgerProcessMessage } from '../interfaces/ledger-process-message.interface'

new AnalyticsManager()

/*
 * NOTE: Ignored because defined by Webpack.
 */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
app.setAppUserModelId(APP_ID)

/**
 * Terminate application if Node remote debugging detected
 */
const argv = process.argv.join()
const flagBlocklist = ['inspect', 'inspect-brk', 'remote-debugging-port']
if (
    argv.includes('inspect') ||
    argv.includes('remote') ||
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    typeof v8debug !== 'undefined' ||
    flagBlocklist.some((flag) => app.commandLine.hasSwitch(flag))
) {
    app.quit()
}

/**
 * Expose Garbage Collector flag for manual trigger after seed usage
 */
app.commandLine.appendSwitch('js-flags', '--expose-gc')

let lastError = {}

/**
 * Setup the error handlers early so they catch any issues
 */
function handleError(errorType, error, isRenderProcessError?): void {
    if (app.isPackaged) {
        const errorMessage = error.message || error.reason || error
        if (!shouldReportError(errorMessage)) {
            console.error(error)
            return
        }

        lastError = {
            diagnostics: getDiagnostics(),
            error,
            errorType,
        }

        openErrorWindow()
    } else {
        const errorMessage = error.message || error.reason || error
        if (!shouldReportError(errorMessage) || !isRenderProcessError) {
            console.error(error)
            return
        }
    }
}

process.on('uncaughtException', (error) => {
    handleError('[Main Context] Unhandled Error', error)
})

process.on('unhandledRejection', (error) => {
    handleError('[Main Context] Unhandled Rejection', error)
})

/**
 * Define wallet windows
 */
const windows: WindowMap = {
    main: null,
    about: null,
    error: null,
}

type WindowMap = {
    [key in Window]: BrowserWindow | null
}

enum Window {
    About = 'about',
    Error = 'error',
    Main = 'main',
}

const paths = {
    html: '',
    aboutHtml: '',
    errorHtml: '',
    preload: '',
    aboutPreload: '',
    errorPreload: '',
    ledger: '',
}

let versionDetails = {
    upToDate: true,
    currentVersion: app.getVersion(),
    newVersion: '',
    newVersionReleaseDate: new Date(),
    changelog: '',
}

/**
 * Default web preferences (see https://www.electronjs.org/docs/tutorial/security)
 */
const DEFAULT_WEB_PREFERENCES: WebPreferences = {
    nodeIntegration: false,
    contextIsolation: true,
    disableBlinkFeatures: 'Auxclick',
    webviewTag: false,
    enableWebSQL: false,
    devTools: !app.isPackaged || features?.electron?.developerTools?.enabled,
}

if (app.isPackaged) {
    paths.html = path.join(app.getAppPath(), '/public/index.html')
    paths.preload = path.join(app.getAppPath(), '/public/build/preload.js')
    paths.aboutHtml = path.join(app.getAppPath(), '/public/about.html')
    paths.aboutPreload = path.join(app.getAppPath(), '/public/build/about.preload.js')
    paths.errorHtml = path.join(app.getAppPath(), '/public/error.html')
    paths.errorPreload = path.join(app.getAppPath(), '/public/build/error.preload.js')
    paths.ledger = path.join(app.getAppPath(), '/public/build/ledger.process.js')
} else {
    // __dirname is desktop/public/build
    paths.html = path.join(__dirname, '../index.html')
    paths.preload = path.join(__dirname, 'preload.js')
    paths.aboutHtml = path.join(__dirname, '../about.html')
    paths.aboutPreload = path.join(__dirname, 'about.preload.js')
    paths.errorHtml = path.join(__dirname, '../error.html')
    paths.errorPreload = path.join(__dirname, 'error.preload.js')
    paths.ledger = path.join(__dirname, 'ledger.process.js')
}

/**
 * Handles url navigation events
 */
function handleNavigation(e: Event, url: string): void {
    if (url === 'http://localhost:8080/') {
        // if localhost would be opened on the build versions, we need to block it to prevent errors
        if (app.isPackaged) {
            e.preventDefault()
        }
        // else: re-open localhost in electron for hot reload
    } else {
        e.preventDefault()

        try {
            void shell.openExternal(url)
        } catch (err) {
            console.error(err)
        }
    }
}

function createMainWindow(): BrowserWindow {
    /**
     * Register firefly file protocol
     */
    try {
        protocol.registerFileProtocol(process.env.APP_PROTOCOL, (request, callback) => {
            callback(request.url.replace(`${process.env.APP_PROTOCOL}:/`, app.getAppPath()).split('?')[0].split('#')[0])
        })
    } catch (err) {
        console.error(err)
    }

    const mainWindowState = windowStateKeeper('main', 'settings.json')

    // Create the browser window
    windows[Window.Main] = new BrowserWindow({
        width: mainWindowState.width,
        height: mainWindowState.height,
        minWidth: 1280,
        minHeight: 720,
        titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'hidden',
        title: app.name,
        frame: process.platform === 'linux',
        icon:
            process.platform === 'linux'
                ? path.join(__dirname, `../assets/icons/${process.env.STAGE}/icon1024x1024.png`)
                : undefined,
        webPreferences: {
            ...DEFAULT_WEB_PREFERENCES,
            preload: paths.preload,
            // Sandboxing is disabled, since our preload script depends on Node.js
            sandbox: false,
        },
    })

    if (mainWindowState.isMaximized) {
        windows[Window.Main].maximize()
    }

    mainWindowState.track(windows[Window.Main])

    if (!app.isPackaged) {
        // Enable dev tools only in developer mode
        windows[Window.Main].webContents.openDevTools()

        void windows[Window.Main].loadURL('http://localhost:8080')
    } else {
        new AutoUpdateManager()

        // load the index.html of the app.
        void windows[Window.Main].loadFile(paths.html)
    }

    new NftDownloadManager()

    /**
     * Right click context menu for inputs
     */
    windows[Window.Main].webContents.on('context-menu', (_e, props) => {
        const { isEditable } = props
        if (isEditable) {
            const options = windows[Window.Main] as PopupOptions
            contextMenu().popup(options)
        }
    })

    /**
     * `will-navigate` is emitted whenever window.location is updated.
     *  This happens e.g. when clicking on a link (<a href="www.iota.org").
     *  The handler only allows navigation to an external browser.
     */
    windows[Window.Main].webContents.on('will-navigate', (a, b) => {
        handleNavigation(a, b)
    })

    windows[Window.Main].on('close', () => {
        closeAboutWindow()
        closeErrorWindow()
    })

    windows[Window.Main].on('closed', () => {
        ledgerProcess?.kill()
        windows[Window.Main] = null
    })

    windows[Window.Main].webContents.on('did-finish-load', () => {
        windows[Window.Main].webContents.send('version-details', versionDetails)
    })

    /**
     * CVE-2022-21718 mitigation
     * Remove when updating to Electron 13.6.6 or later
     * https://github.com/advisories/GHSA-3p22-ghq8-v749
     */
    windows[Window.Main].webContents.on('select-bluetooth-device', (event, _devices, cb) => {
        event.preventDefault()
        // Cancel the request
        cb('')
    })

    /**
     * Handle permissions requests
     */
    session.defaultSession.setPermissionRequestHandler((_webContents, permission, cb, details) => {
        if (permission === 'openExternal' && details && details.externalURL) {
            return cb(true)
        }

        const permissionAllowlist = ['clipboard-read', 'notifications', 'fullscreen']

        return cb(permissionAllowlist.indexOf(permission) > -1)
    })

    return windows[Window.Main]
}

void app.whenReady().then(createMainWindow)

let ledgerProcess
ipcMain.on('start-ledger-process', () => {
    ledgerProcess = utilityProcess.fork(paths.ledger)
    ledgerProcess.on('spawn', () => {
        // Handler for message from Ledger process
        ledgerProcess.on('message', (message: ILedgerProcessMessage) => {
            const { error, data } = message
            if (error) {
                windows[Window.Main].webContents.send('ledger-error', error)
            } else {
                switch (data?.method) {
                    case LedgerMethod.GenerateEvmAddress:
                        windows[Window.Main].webContents.send('evm-address', data)
                        break
                    case LedgerMethod.SignEvmTransaction:
                        windows[Window.Main].webContents.send('evm-signed-transaction', data)
                        break
                    default:
                        /* eslint-disable-next-line no-console */
                        console.log('Unhandled Ledger Message: ', message)
                        break
                }
            }
        })
    })
})

ipcMain.on('kill-ledger-process', () => {
    ledgerProcess?.kill()
})

ipcMain.on(LedgerMethod.GenerateEvmAddress, (_e, bip32Path, verify) => {
    ledgerProcess?.postMessage({ method: LedgerMethod.GenerateEvmAddress, parameters: [bip32Path, verify] })
})

ipcMain.on(LedgerMethod.SignEvmTransaction, (_e, data, bip32Path) => {
    ledgerProcess?.postMessage({ method: LedgerMethod.SignEvmTransaction, parameters: [data, bip32Path] })
})

export const getWindow = (windowName: string): BrowserWindow => windows[windowName]

export function getOrInitWindow(windowName: string): BrowserWindow {
    if (!windows[windowName]) {
        if (windowName === 'main') {
            return createMainWindow()
        }
        if (windowName === 'about') {
            return openAboutWindow()
        }
        if (windowName === 'error') {
            return openErrorWindow()
        }
    }
    return windows[windowName]
}

initMenu()

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.once('ready', () => {
    ipcMain.handle('error-data', () => lastError)
    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        //
        // This listener must be created once the app is ready,
        // otherwise we run into https://github.com/iotaledger/firefly/issues/1006
        // because the `activate` event is also emitted when the app is launched for the first time
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow()
        }
    })
})

// IPC handlers for APIs exposed from main proces

// URLs
ipcMain.handle('open-url', (_e, url) => {
    handleNavigation(_e, url)
})

// Keychain
const keychainManager = new KeychainManager()
ipcMain.handle('keychain-get', (_e, key) => keychainManager.get(key))
ipcMain.handle('keychain-set', (_e, key, content) => keychainManager.set(key, content))
ipcMain.handle('keychain-remove', (_e, key) => keychainManager.remove(key))

// Dialogs
ipcMain.handle('show-open-dialog', (_e, options) => dialog.showOpenDialog(options))
ipcMain.handle('show-save-dialog', (_e, options) => dialog.showSaveDialog(options))

// Miscellaneous
ipcMain.handle('get-path', (_e, path) => {
    const allowedPaths = ['userData']
    if (allowedPaths.indexOf(path) === -1) {
        throw Error(`Path ${path} is not allowed`)
    }
    return app.getPath(path)
})
ipcMain.handle('get-version-details', () => versionDetails)

function ensureDirectoryExistence(filePath: string): void | boolean {
    const dirname = path.dirname(filePath)
    if (fs.existsSync(dirname)) {
        return true
    }
    ensureDirectoryExistence(dirname)
    fs.mkdirSync(dirname)
}

ipcMain.handle('copy-file', (_e, sourceFilePath, destinationFilePath) => {
    const src = path.resolve(sourceFilePath)
    const srcFileBuffer = fs.readFileSync(src)
    const dest = path.resolve(destinationFilePath)
    ensureDirectoryExistence(dest)
    fs.writeFileSync(dest, srcFileBuffer)
})

ipcMain.handle('delete-file', (_e, filePath) => {
    const userPath = app.getPath('userData')
    const directory = app.isPackaged ? userPath : __dirname
    const src = path.resolve(`${directory}/__storage__/${filePath}`)

    fs.rmSync(src, { recursive: true, force: true })
})

ipcMain.handle('check-if-file-exists', (_e, filePath) => {
    const userPath = app.getPath('userData')
    const directory = app.isPackaged ? userPath : __dirname

    return fs.existsSync(`${directory}/__storage__/${filePath}`)
})

ipcMain.handle('diagnostics', () => getDiagnostics())

ipcMain.handle('handle-error', (_e, errorType, error) => {
    handleError(errorType, error, true)
})

// System
ipcMain.handle('get-os', () => process.platform)
ipcMain.handle('get-machine-id', () => getMachineId())

// Settings
ipcMain.handle('update-app-settings', (_e, settings) => updateSettings(settings))
ipcMain.handle('update-theme', (_e, theme) => (nativeTheme.themeSource = theme))

/**
 * Define deep link state
 */
let deepLinkUrl = null

/**
 * Create a single instance only
 */
const isFirstInstance = app.requestSingleInstanceLock()

if (!isFirstInstance) {
    app.quit()
}

app.on('second-instance', (_e, args) => {
    if (windows[Window.Main]) {
        if (args.length > 1) {
            const params = args.find((arg) => arg.startsWith(`${process.env.APP_PROTOCOL}://`))

            if (params) {
                windows[Window.Main].webContents.send('deep-link-params', params)
            }
        }
        if (windows[Window.Main].isMinimized()) {
            windows[Window.Main].restore()
        }
        windows[Window.Main].focus()
    }
})

/**
 * Register firefly:// protocol for deep links
 * Set Firefly as the default handler for firefly:// protocol
 */
protocol.registerSchemesAsPrivileged([
    { scheme: process.env.APP_PROTOCOL, privileges: { secure: true, standard: true } },
])
if (process.defaultApp) {
    if (process.argv.length >= 2) {
        app.setAsDefaultProtocolClient(process.env.APP_PROTOCOL, process.execPath, [path.resolve(process.argv[1])])
    }
} else {
    app.setAsDefaultProtocolClient(process.env.APP_PROTOCOL)
}

/**
 * Proxy deep link event to the wallet application
 */
app.on('open-url', (event, url) => {
    event.preventDefault()
    deepLinkUrl = url
    if (windows[Window.Main]) {
        windows[Window.Main].webContents.send('deep-link-params', deepLinkUrl)
        windows[Window.Main].webContents.send('deep-link-request')
    }
})

/**
 * Check if a deep link request/event currently exists and has not been cleared
 */
ipcMain.on('check-deep-link-request-exists', () => {
    if (deepLinkUrl) {
        windows[Window.Main].webContents.send('deep-link-params', deepLinkUrl)
    }
})

/**
 * Clear deep link request/event
 */
ipcMain.on('clear-deep-link-request', () => {
    deepLinkUrl = null
})

/**
 * Proxy notification activated to the wallet application
 */
ipcMain.on('notification-activated', (ev, contextData) => {
    windows[Window.Main].focus()
    windows[Window.Main].webContents.send('notification-activated', contextData)
})

/**
 * Create about window
 * @returns {BrowserWindow} About window
 */
export function openAboutWindow(): BrowserWindow {
    if (windows[Window.About] !== null) {
        windows[Window.About].focus()
        return windows[Window.About]
    }

    windows[Window.About] = new BrowserWindow({
        width: 380,
        height: 230,
        useContentSize: true,
        titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'hidden',

        // affects only WindowsOS
        titleBarOverlay: {
            color: '#192742',
            symbolColor: '#ffffff',
        },

        show: false,
        fullscreenable: false,
        resizable: false,
        minimizable: false,
        webPreferences: {
            ...DEFAULT_WEB_PREFERENCES,
            preload: paths.aboutPreload,
        },
    })

    windows[Window.About].once('closed', () => {
        windows[Window.About] = null
    })

    void windows[Window.About].loadFile(paths.aboutHtml)

    windows[Window.About].once('ready-to-show', () => {
        windows[Window.About].show()
    })

    windows[Window.About].setMenu(null)

    return windows[Window.About]
}

export function closeAboutWindow(): void {
    if (windows[Window.About]) {
        windows[Window.About].close()
        windows[Window.About] = null
    }
}

export function openErrorWindow(): BrowserWindow {
    if (windows[Window.Error] !== null) {
        windows[Window.Error].focus()
        return windows[Window.Error]
    }

    windows[Window.Error] = new BrowserWindow({
        useContentSize: true,
        titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'hidden',
        show: false,
        fullscreenable: false,
        resizable: true,
        minimizable: false,
        webPreferences: {
            ...DEFAULT_WEB_PREFERENCES,
            preload: paths.errorPreload,
        },
    })

    windows[Window.Error].once('closed', () => {
        windows[Window.Error] = null
    })

    void windows[Window.Error].loadFile(paths.errorHtml)

    windows[Window.Error].once('ready-to-show', () => {
        windows[Window.Error].show()
    })

    windows[Window.Error].setMenu(null)

    return windows[Window.Error]
}

export function closeErrorWindow(): void {
    if (windows[Window.Error]) {
        windows[Window.Error].close()
        windows[Window.Error] = null
    }
}

function windowStateKeeper(windowName: string, settingsFilename: string): IAppState {
    let window: BrowserWindow
    let windowState: IAppState

    function setBounds(): void {
        const settings = <ISettings>loadJsonConfig(settingsFilename)

        if (settings && settings.windowState && settings.windowState[windowName]) {
            windowState = settings.windowState[windowName]
            return
        }

        // Default
        windowState = <IAppState>{
            x: undefined,
            y: undefined,
            width: 1280,
            height: 720,
        }
    }

    function saveState(): void {
        windowState.isMaximized = window.isMaximized()
        if (!windowState.isMaximized) {
            windowState = window.getBounds() as IAppState
        }

        let settings = loadJsonConfig(settingsFilename) as ISettings

        settings = settings || <ISettings>{}
        settings.windowState = settings.windowState || <IAppState>{}
        settings.windowState[windowName] = windowState

        saveJsonConfig(settingsFilename, settings)
    }

    function track(win: BrowserWindow): void {
        window = win
        Array.from(['resized', 'moved', 'closed']).forEach((event) => {
            /* eslint-disable @typescript-eslint/ban-ts-comment */
            // @ts-ignore
            win.on(event, saveState)
        })
    }

    setBounds()

    return {
        x: windowState.x,
        y: windowState.y,
        width: windowState.width,
        height: windowState.height,
        isMaximized: windowState.isMaximized,
        track,
    }
}

interface ISettings {
    windowState: IAppState
}

interface IAppState {
    x: number
    y: number
    width: number
    height: number
    isMaximized: boolean

    track(window: BrowserWindow): void
}

function updateSettings(data: object): void {
    const filename = 'settings.json'
    const config = loadJsonConfig(filename)

    /**
     * CAUTION: We must be careful saving properties to this file, as
     * once we decide to save it there then it will be there forever
     * even if the name changes later.
     */
    saveJsonConfig(filename, { ...config, ...data })
}

function saveJsonConfig(filename: string, data: object): void {
    try {
        fs.writeFileSync(getJsonConfig(filename), JSON.stringify(data))
    } catch (err) {
        console.error(err)
    }
}

function loadJsonConfig(filename: string): object {
    try {
        return JSON.parse(fs.readFileSync(getJsonConfig(filename)).toString())
    } catch (err) {
        if (!err.message.includes('ENOENT')) {
            console.error(err)
        }
    }
}

function getJsonConfig(filename: string): string {
    const userDataPath = app.getPath('userData')
    return path.join(userDataPath, filename)
}

export function updateAppVersionDetails(details: object): void {
    versionDetails = Object.assign({}, versionDetails, details)

    getOrInitWindow('main').webContents.send('version-details', versionDetails)
}
