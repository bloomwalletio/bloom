// Modules to control application life and create native browser window
import {
    app,
    BrowserWindow,
    dialog,
    ipcMain,
    nativeTheme,
    PopupOptions,
    session,
    shell,
    utilityProcess,
    UtilityProcess,
} from 'electron'
import fs from 'fs'
import path from 'path'

import features from '@features/features'

import { LedgerApiMethod } from '@core/ledger/enums'

import { ITransakWindowData } from '@core/app/interfaces'
import { DEFAULT_WEB_PREFERENCES } from '../constants/default-web-preferences.constant'
import { windows } from '../constants/windows.constant'
import { IElectronSettings, IWindowState } from '../interfaces'
import type { ILedgerProcessMessage } from '../interfaces/ledger-process-message.interface'
import { registerPowerMonitorListeners } from '../listeners'
import AutoUpdateManager from '../managers/auto-update.manager'
import { ElectronSettingsManager } from '../managers/electron-settings.manager'
import KeychainManager from '../managers/keychain.manager'
import NftDownloadManager from '../managers/nft-download.manager'
import ThirdPartyAppManager from '../managers/third-party-profiles.manager'
import TransakManager from '../managers/transak.manager'
import { contextMenu } from '../menus/context.menu'
import { initMenu } from '../menus/menu'
import { initialiseAnalytics } from '../utils/analytics.utils'
import { checkWindowArgsForDeepLinkRequest, initialiseDeepLinks } from '../utils/deep-link.utils'
import { getDiagnostics } from '../utils/diagnostics.utils'
import { shouldReportError } from '../utils/error.utils'
import { ensureDirectoryExistence } from '../utils/file-system.utils'
import { getMachineId } from '../utils/os.utils'
import { AboutWindow } from '../windows/about.window'

export let appIsReady = false

initialiseAnalytics()
initialiseDeepLinks()

/*
 * NOTE: Ignored because defined by Webpack.
 */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-expect-error
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
    // @ts-expect-error
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
    errorHtml: '',
    preload: '',
    errorPreload: '',
    ledger: '',
}

if (app.isPackaged) {
    paths.html = path.join(app.getAppPath(), '/public/index.html')
    paths.preload = path.join(app.getAppPath(), '/public/build/preload.js')
    paths.errorHtml = path.join(app.getAppPath(), '/public/error.html')
    paths.errorPreload = path.join(app.getAppPath(), '/public/build/error.preload.js')
    paths.ledger = path.join(app.getAppPath(), '/public/build/ledger.process.js')
} else {
    // __dirname is desktop/public/build
    paths.html = path.join(__dirname, '../index.html')
    paths.preload = path.join(__dirname, 'preload.js')
    paths.errorHtml = path.join(__dirname, '../error.html')
    paths.errorPreload = path.join(__dirname, 'error.preload.js')
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

let autoUpdateManager: AutoUpdateManager
export function createMainWindow(): BrowserWindow {
    const mainWindowState = windowStateKeeper('main')

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

    mainWindowState.track?.(windows.main)

    if (!app.isPackaged) {
        // Enable dev tools only in developer mode
        windows.main.webContents.openDevTools()

        void windows.main.loadURL('http://localhost:8080')
    } else {
        autoUpdateManager = new AutoUpdateManager()

        // load the index.html of the app.
        void windows.main.loadFile(paths.html)
    }

    new NftDownloadManager()
    new ThirdPartyAppManager()

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
     *  Navigation to an external browser happens through open-external-url event.
     *  For security reasons we prevent any navigation through this event.
     */
    windows.main.webContents.on('will-navigate', (e) => {
        e.preventDefault()
    })

    windows.main.on('close', () => {
        AboutWindow.close()
        closeErrorWindow()
        transakManager?.closeWindow()
    })

    windows.main.on('closed', () => {
        ledgerProcess?.kill()
        windows.main = null
    })

    windows.main.webContents.on('did-finish-load', () => {
        windows.main?.webContents?.send?.('version-details', autoUpdateManager.getVersionDetails())
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

    windows.main.webContents.setWindowOpenHandler((details) => {
        try {
            windows.main?.webContents?.send?.('try-open-url-in-browser', details.url)
        } catch (err) {
            console.error(err)
        }
        return { action: 'deny' }
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

    registerPowerMonitorListeners()

    return windows.main
}

void app.whenReady().then(() => {
    // Doesn't open & close a new window when the app is already open
    if (isFirstInstance) {
        createMainWindow()
        appIsReady = true
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
                windows.main?.webContents?.send?.('ledger-error', error)
            } else {
                switch (method) {
                    case LedgerApiMethod.GenerateEvmAddress:
                        windows.main?.webContents?.send?.('evm-address', payload)
                        break
                    case LedgerApiMethod.GetEthereumAppSettings:
                        windows.main?.webContents?.send?.('ethereum-app-settings', payload)
                        break
                    case LedgerApiMethod.SignEvmTransaction:
                        windows.main?.webContents?.send?.('evm-signed-transaction', payload)
                        break
                    case LedgerApiMethod.SignMessage:
                        windows.main?.webContents?.send?.('signed-message', payload)
                        break
                    case LedgerApiMethod.SignEIP712:
                        windows.main?.webContents?.send?.('signed-eip712', payload)
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

ipcMain.on(LedgerApiMethod.SignEIP712, (_e, hashedDomain, hashedMessage, bip32Path) => {
    ledgerProcess?.postMessage({
        method: LedgerApiMethod.SignEIP712,
        payload: [hashedDomain, hashedMessage, bip32Path],
    })
})

export function getOrInitWindow(windowName: string, ...args: unknown[]): BrowserWindow {
    if (!windows[windowName]) {
        switch (windowName) {
            case 'main':
                return createMainWindow()
            case 'error':
                return openErrorWindow()
            case 'transak': {
                const transakWindow = transakManager?.openWindow(args[0] as ITransakWindowData)
                if (transakWindow) {
                    return transakWindow
                }
                break
            }
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

// IPC handlers for APIs exposed from main process

// URLs
ipcMain.handle('open-external-url', (_e, url) => {
    tryOpenExternalUrl(_e as unknown as Event, url)
})

// Keychain
const keychainManager = new KeychainManager()
ipcMain.handle('keychain-get', (_e, key, appName) => keychainManager.get(key, appName))
ipcMain.handle('keychain-set', (_e, key, content) => keychainManager.set(key, content))
ipcMain.handle('keychain-remove', (_e, key) => keychainManager.remove(key))
// Dialogs
ipcMain.handle('show-open-dialog', (_e, options) => dialog.showOpenDialog(options))
ipcMain.handle('show-save-dialog', (_e, options) => {
    const filePath = path.resolve(app.getPath('documents'), options.defaultPath)

    return dialog.showSaveDialog({ ...options, defaultPath: filePath })
})

// Miscellaneous
ipcMain.handle('get-path', (_e, path) => {
    const allowedPaths = ['userData']
    if (allowedPaths.indexOf(path) === -1) {
        throw Error(`Path ${path} is not allowed`)
    }
    return app.getPath(path)
})
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
ipcMain.handle('update-app-settings', (_e, settings) => ElectronSettingsManager.updateSettings(settings))

// Theme
nativeTheme.on('updated', () => {
    windows.main?.webContents?.send?.('native-theme-updated')
})

ipcMain.handle('get-theme', () => nativeTheme.themeSource)
ipcMain.handle('update-theme', (_e, theme) => {
    nativeTheme.themeSource = theme
    if (features?.buySell?.enabled) {
        windows.main?.webContents?.send?.('reset-transak')
    }
})
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
    windows.main?.focus?.()
    windows.main?.webContents?.send?.('notification-activated', contextData)
})

// Transak

const transakManager = features?.buySell?.enabled ? new TransakManager() : null
ipcMain.handle('open-transak', (_, data) => {
    getOrInitWindow('transak', data)
})

ipcMain.handle('close-transak', () => {
    transakManager?.closeWindow()
})

ipcMain.handle('hide-transak', () => {
    transakManager?.hideWindow()
})

ipcMain.handle('show-transak', () => {
    transakManager?.showWindow()
})

ipcMain.handle('update-transak-bounds', (event, rect) => {
    transakManager?.updateTransakBounds(rect)
})

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

function windowStateKeeper(windowName: string): IWindowState {
    let window: BrowserWindow
    let windowState = <IWindowState>{
        x: 0,
        y: 0,
        width: 1280,
        height: process.platform === 'win32' ? 720 + 28 : 720,
    }

    function setBounds(): void {
        const settings = ElectronSettingsManager.loadSettings()

        if (settings && settings.windowState && settings.windowState[windowName]) {
            windowState = settings.windowState[windowName]
            return
        }
    }

    function saveState(): void {
        windowState.isMaximized = window.isMaximized()
        if (!windowState.isMaximized) {
            windowState = window.getBounds() as IWindowState
        }

        let settings = ElectronSettingsManager.loadSettings()

        settings = settings || <IElectronSettings>{}
        settings.windowState = settings.windowState || <IWindowState>{}
        settings.windowState[windowName] = windowState

        ElectronSettingsManager.saveSettings(settings)
    }

    function track(win: BrowserWindow): void {
        window = win
        Array.from(['resized', 'moved', 'close']).forEach((event) => {
            /* eslint-disable @typescript-eslint/ban-ts-comment */
            // @ts-expect-error
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
