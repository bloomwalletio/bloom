import { app, ipcMain, protocol } from 'electron'
import path from 'path'
import { windows } from '../constants/windows.constant'
import { createMainWindow } from '../processes/main.process'

/**
 * Define deep link state
 */
let deepLinkUrl: string | null = null

export function initialiseDeepLinks(): void {
    setAppAsDefaultProtocolClient()

    /**
     * Handle deep linking on Mac
     * https://www.electronjs.org/docs/latest/api/app#event-open-url-macos
     * Emitted on macOS when the user wants to open a URL with the application
     */
    app.on('open-url', handleDeepLinkEventOnMac)

    // Handle deep linking when the app was not opened yet
    // Deep linking for when the app is not running already (Windows, Linux)
    ipcMain.on('dom-content-loaded', (event) => {
        if (windows.main) {
            checkWindowArgsForDeepLink(event, process.argv)
        }
    })

    ipcMain.on('check-deep-link-request-exists', checkDeepLinkRequestExists)
    ipcMain.on('clear-deep-link-request', clearDeepLinkRequest)
}

function setAppAsDefaultProtocolClient(): void {
    /**
     * Register bloom:// protocol for deep links
     * https://www.electronjs.org/docs/latest/api/protocol#protocolregisterschemesasprivilegedcustomschemes
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
}

function handleDeepLinkEventOnMac(event: Electron.Event, url: string): void {
    event.preventDefault()
    if (windows.main) {
        windows.main.restore()
        windows.main.focus()
        sendDeepLinkRequestToRenderer(url)
    } else {
        createMainWindow()
        deepLinkUrl = url
    }
}

export function checkWindowArgsForDeepLink(_e: Electron.Event, args: string[]): void {
    if (args.length > 1) {
        const url = args.find((arg) => arg.startsWith(`${process.env.APP_PROTOCOL}://`))

        if (url) {
            sendDeepLinkRequestToRenderer(url)
        }
    }
}

function checkDeepLinkRequestExists(): void {
    if (deepLinkUrl) {
        sendDeepLinkRequestToRenderer(deepLinkUrl)
    }
}

function sendDeepLinkRequestToRenderer(url: string): void {
    deepLinkUrl = url
    if (windows.main) {
        windows.main.webContents.send('deep-link-request', deepLinkUrl)
    }
}

function clearDeepLinkRequest(): void {
    deepLinkUrl = null
}
