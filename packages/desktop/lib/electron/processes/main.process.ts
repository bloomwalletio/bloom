// Modules to control application life and create native browser window
import {
    app,
    BrowserWindow,
    dialog,
    ipcMain,
    nativeTheme,
    PopupOptions,
    powerMonitor,
    session,
    shell,
    utilityProcess,
    UtilityProcess,
} from 'electron'
import { WebPreferences } from 'electron/main'
import path from 'path'
import fs from 'fs'

import features from '@features/features'

import { LedgerApiMethod } from '@core/ledger/enums'

import { windows } from '../constants/windows.constant'
import AutoUpdateManager from '../managers/auto-update.manager'
import KeychainManager from '../managers/keychain.manager'
import NftDownloadManager from '../managers/nft-download.manager'
import { contextMenu } from '../menus/context.menu'
import { initMenu } from '../menus/menu'
import { initialiseAnalytics } from '../utils/analytics.utils'
import { checkWindowArgsForDeepLinkRequest, initialiseDeepLinks } from '../utils/deep-link.utils'
import { getDiagnostics } from '../utils/diagnostics.utils'
import { shouldReportError } from '../utils/error.utils'
import { getMachineId } from '../utils/os.utils'
import type { ILedgerProcessMessage } from '../interfaces/ledger-process-message.interface'
import { ensureDirectoryExistence } from '../utils/file-system.utils'

initialiseAnalytics()
initialiseDeepLinks()
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

const paths = {
    html: '',
    aboutHtml: '',
    errorHtml: '',
    transakHtml: '',
    preload: '',
    aboutPreload: '',
    errorPreload: '',
    transakPreload: '',
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
    paths.transakHtml = path.join(app.getAppPath(), '/public/transak.html')
    paths.transakPreload = path.join(app.getAppPath(), '/public/build/transak.preload.js')
    paths.ledger = path.join(app.getAppPath(), '/public/build/ledger.process.js')
} else {
    // __dirname is desktop/public/build
    paths.html = path.join(__dirname, '../index.html')
    paths.preload = path.join(__dirname, 'preload.js')
    paths.aboutHtml = path.join(__dirname, '../about.html')
    paths.aboutPreload = path.join(__dirname, 'about.preload.js')
    paths.errorHtml = path.join(__dirname, '../error.html')
    paths.errorPreload = path.join(__dirname, 'error.preload.js')
    paths.transakHtml = path.join(__dirname, '../transak.html')
    paths.transakPreload = path.join(__dirname, 'transak.preload.js')
    paths.ledger = path.join(__dirname, 'ledger.process.js')
}

/**
 * Handles url navigation events
 */
function tryOpenExternalUrl(e: Event, url: string): void {
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

export function createMainWindow(): BrowserWindow {
    const mainWindowState = windowStateKeeper('main', 'settings.json')

    // Create the browser window
    windows.main = new BrowserWindow({
        width: mainWindowState.width,
        height: mainWindowState.height,
        minWidth: 1280,
        minHeight: process.platform === 'win32' ? 720 + 28 : 720,
        titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'hidden',
        title: app.name,
        frame: process.platform === 'linux',
        icon:
            process.platform === 'linux'
                ? path.join(__dirname, `./icons/${process.env.STAGE}/linux/icon.png`)
                : undefined,
        webPreferences: {
            ...DEFAULT_WEB_PREFERENCES,
            preload: paths.preload,
            // Sandboxing is disabled, since our preload script depends on Node.js
            sandbox: false,
        },
    })

    if (mainWindowState.isMaximized) {
        windows.main.maximize()
    }

    mainWindowState.track(windows.main)

    if (!app.isPackaged) {
        // Enable dev tools only in developer mode
        windows.main.webContents.openDevTools()

        void windows.main.loadURL('http://localhost:8080')
    } else {
        new AutoUpdateManager()

        // load the index.html of the app.
        void windows.main.loadFile(paths.html)
    }

    new NftDownloadManager()

    /**
     * Right click context menu for inputs
     */
    windows.main.webContents.on('context-menu', (_e, props) => {
        const { isEditable } = props
        if (isEditable) {
            const options = windows.main as PopupOptions
            contextMenu().popup(options)
        }
    })

    /**
     * `will-navigate` is emitted whenever window.location is updated.
     *  This happens e.g. when clicking on a link (<a href="www.iota.org").
     *  The handler only allows navigation to an external browser.
     */
    windows.main.webContents.on('will-navigate', (a, b) => {
        tryOpenExternalUrl(a as unknown as Event, b)
    })

    windows.main.on('close', () => {
        closeAboutWindow()
        closeErrorWindow()
    })

    windows.main.on('closed', () => {
        ledgerProcess?.kill()
        windows.main = null
    })

    windows.main.webContents.on('did-finish-load', () => {
        windows.main.webContents.send('version-details', versionDetails)
    })

    /**
     * CVE-2022-21718 mitigation
     * Remove when updating to Electron 13.6.6 or later
     * https://github.com/advisories/GHSA-3p22-ghq8-v749
     */
    windows.main.webContents.on('select-bluetooth-device', (event, _devices, cb) => {
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

    return windows.main
}

void app.whenReady().then(() => {
    // Doesn't open & close a new window when the app is already open
    if (isFirstInstance) {
        createMainWindow()
    }
})

let ledgerProcess: UtilityProcess
ipcMain.on('start-ledger-process', () => {
    ledgerProcess = utilityProcess.fork(paths.ledger)
    ledgerProcess.on('spawn', () => {
        // Handler for message from Ledger process
        ledgerProcess.on('message', (message: ILedgerProcessMessage) => {
            const { method, payload, error } = message

            if (error) {
                windows.main.webContents.send('ledger-error', error)
            } else {
                switch (method) {
                    case LedgerApiMethod.GenerateEvmAddress:
                        windows.main.webContents.send('evm-address', payload)
                        break
                    case LedgerApiMethod.GetEthereumAppSettings:
                        windows.main.webContents.send('ethereum-app-settings', payload)
                        break
                    case LedgerApiMethod.SignEvmTransaction:
                        windows.main.webContents.send('evm-signed-transaction', payload)
                        break
                    case LedgerApiMethod.SignMessage:
                        windows.main.webContents.send('signed-message', payload)
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

ipcMain.on(LedgerApiMethod.GenerateEvmAddress, (_e, bip32Path, verify) => {
    ledgerProcess?.postMessage({ method: LedgerApiMethod.GenerateEvmAddress, payload: [bip32Path, verify] })
})

ipcMain.on(LedgerApiMethod.GetEthereumAppSettings, () => {
    ledgerProcess?.postMessage({ method: LedgerApiMethod.GetEthereumAppSettings })
})

ipcMain.on(LedgerApiMethod.SignEvmTransaction, (_e, transactionHex, bip32Path) => {
    ledgerProcess?.postMessage({ method: LedgerApiMethod.SignEvmTransaction, payload: [transactionHex, bip32Path] })
})

ipcMain.on(LedgerApiMethod.SignMessage, (_e, messageHex, bip32Path) => {
    ledgerProcess?.postMessage({ method: LedgerApiMethod.SignMessage, payload: [messageHex, bip32Path] })
})

export function getOrInitWindow(windowName: string, ...args: unknown[]): BrowserWindow {
    if (!windows[windowName]) {
        switch (windowName) {
            case 'main':
                return createMainWindow()
            case 'about':
                return openAboutWindow()
            case 'error':
                return openErrorWindow()
            case 'transak':
                return openTransakWindow(args[0] as { currency: string, address: string, service: 'BUY' | 'SELL' })
            default:
                throw Error(`Window ${windowName} not found`)
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

powerMonitor.on('suspend', () => {
    // MacOS, Windows and Linux
    windows.main?.webContents?.send('lock-screen')
})

powerMonitor.on('lock-screen', () => {
    // MacOS and Windows
    windows.main?.webContents?.send('lock-screen')
})

// IPC handlers for APIs exposed from main process

// URLs
ipcMain.handle('open-external-url', (_e, url) => {
    tryOpenExternalUrl(_e as unknown as Event, url)
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
ipcMain.handle('focus-window', () => {
    if (windows.main) {
        if (windows.main.isMinimized()) {
            windows.main.restore()
        }
        windows.main.show()
        windows.main.setAlwaysOnTop(true)
        windows.main.setAlwaysOnTop(false)
    }
})

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
ipcMain.handle('get-machine-id', () => getMachineId())

// Settings
ipcMain.handle('update-app-settings', (_e, settings) => updateSettings(settings))

// Theme
nativeTheme.on('updated', () => {
    windows.main.webContents.send('native-theme-updated')
})

ipcMain.handle('get-theme', () => nativeTheme.themeSource)
ipcMain.handle('update-theme', (_e, theme) => (nativeTheme.themeSource = theme))
ipcMain.handle('should-be-dark-mode', () => nativeTheme.shouldUseDarkColors)

/**
 * Create a single instance only
 */
const isFirstInstance = app.requestSingleInstanceLock()
if (!isFirstInstance) {
    app.quit()
} else {
    app.on('second-instance', (_e, argv) => {
        if (windows.main) {
            if (windows.main.isMinimized()) {
                windows.main.restore()
            }
            windows.main.focus()

            checkWindowArgsForDeepLinkRequest(_e, argv)
        }
    })
}

/**
 * Proxy notification activated to the wallet application
 */
ipcMain.on('notification-activated', (ev, contextData) => {
    windows.main.focus()
    windows.main.webContents.send('notification-activated', contextData)
})

ipcMain.handle('open-transak', (_, data) => {
    getOrInitWindow('transak', data)
})

ipcMain.handle('close-transak', () => {
    closeTransakWindow()
})

/**
 * Create about window
 * @returns {BrowserWindow} About window
 */
export function openAboutWindow(): BrowserWindow {
    if (windows.about !== null) {
        windows.about.focus()
        return windows.about
    }

    windows.about = new BrowserWindow({
        width: 380,
        height: 230,
        useContentSize: true,
        titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'hidden',
        /**
         * NOTE: This only affects Windows.
         */
        titleBarOverlay: {
            color: '#192742',
            symbolColor: '#ffffff',
        },
        show: true,
        fullscreenable: false,
        resizable: false,
        minimizable: false,
        webPreferences: {
            ...DEFAULT_WEB_PREFERENCES,
            preload: paths.aboutPreload,
        },
    })

    windows.about.once('closed', () => {
        windows.about = null
    })

    void windows.about.loadFile(paths.aboutHtml)

    windows.about.setMenu(null)

    return windows.about
}

export function closeAboutWindow(): void {
    if (windows.about) {
        windows.about.close()
        windows.about = null
    }
}

export function openErrorWindow(): BrowserWindow {
    if (windows.error !== null) {
        return windows.error
    }

    windows.error = new BrowserWindow({
        useContentSize: true,
        titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'hidden',
        show: true,
        fullscreenable: false,
        resizable: true,
        minimizable: false,
        webPreferences: {
            ...DEFAULT_WEB_PREFERENCES,
            preload: paths.errorPreload,
        },
    })

    windows.error.once('closed', () => {
        windows.error = null
    })

    void windows.error.loadFile(paths.errorHtml)

    windows.error.setMenu(null)

    return windows.error
}

export function closeErrorWindow(): void {
    if (windows.error) {
        windows.error.close()
        windows.error = null
    }
}

export function openTransakWindow(data: { currency: string, address: string, service: 'BUY' | 'SELL' }): BrowserWindow {
    if (windows.transak !== null) {
        return windows.transak
    }

    windows.transak = new BrowserWindow({
        parent: windows.main,
        width: 480,
        height: getTransakHeight(),
        useContentSize: true,
        titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'hidden',
        show: true,
        fullscreenable: false,
        resizable: false,
        minimizable: false,
        webPreferences: {
            ...DEFAULT_WEB_PREFERENCES,
            contextIsolation: true,
            preload: paths.transakPreload,
        },
    })

    positionTransakWindow()
    sizeTransakWindow()
    windows.main.on('move', positionTransakWindow);
    windows.main.on('resize', () => {
        positionTransakWindow()
        sizeTransakWindow()
    })

    windows.transak.once('closed', () => {
        windows.transak = null
    })

    windows.transak.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
        if (permission === 'media') {
            callback(true);
        } else {
            callback(false);
        }
    })

    void windows.transak.loadFile(paths.transakHtml)

    windows.transak.webContents.on('did-finish-load', () => {
        const _data = {
            currency: data.currency,
            address: data.address,
            stage: app.isPackaged ? 'production' : 'staging',
            apiKey: process.env.TRANSAK_API_KEY,
            service: data.service,
        }
        windows.transak.webContents.send('transak-data', _data)
    })

    windows.transak.setMenu(null)

    return windows.transak
}

export function closeTransakWindow(): void {
    if (windows.transak) {
        windows.transak.close()
        windows.transak = null
    }
}

function positionTransakWindow(): void {
    const [mainWindowX, mainWindowY] = windows.main.getPosition();
    const [mainWindowWidth] = windows.main.getSize();
    const [transakWidth] = windows.transak.getSize();

    const transakX = mainWindowX + mainWindowWidth - transakWidth - 32;
    const transakY = mainWindowY + 32 + 40 + 28;

    windows.transak.setPosition(transakX, transakY);
}

function sizeTransakWindow(): void {
    const [transakWidth] = windows.transak.getSize();
    const transakHeight = getTransakHeight();
    windows.transak.setSize(transakWidth, transakHeight);
}

function getTransakHeight(): number {
    const [, mainWindowHeight] = windows.main.getSize();
    return mainWindowHeight - 32 - 40 - 28 - 32;
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
            height: process.platform === 'win32' ? 720 + 28 : 720,
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
        Array.from(['resized', 'moved', 'close']).forEach((event) => {
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
