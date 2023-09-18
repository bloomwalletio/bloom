import path from 'path'
import { app, ipcMain, protocol } from 'electron'
import { windows } from '../constants/windows.constant'
import { createMainWindow } from '../processes/main.process'

/**
 * Define deep link state
 */
let deepLinkRequest: string | undefined = undefined

export function initialiseDeepLinks(): void {
    setAppAsDefaultProtocolClient()

    /**
     * Handle deep linking on Mac
     * https://www.electronjs.org/docs/latest/api/app#event-open-url-macos
     * Emitted on macOS when the user wants to open a URL with the application
     */
    app.on('open-url', handleDeepLinkEventOnMac)

    // Check if deep link was passed when the app was not running
    ipcMain.on('dom-content-loaded', (event) => {
        if (windows.main) {
            checkWindowArgsForDeepLinkRequest(event, process.argv)
        }
    })

    ipcMain.on('check-for-deep-link-request', checkForDeepLinkRequest)
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
            const appPath = path.resolve(process.argv[1])
            app.setAsDefaultProtocolClient(process.env.APP_PROTOCOL, process.execPath, [appPath])
        }
    } else {
        app.setAsDefaultProtocolClient(process.env.APP_PROTOCOL)
    }
}

function sendDeepLinkRequestToRenderer(url: string): void {
    if (windows.main) {
        windows.main.webContents.send('deep-link-request', url)
    }
}

function handleDeepLinkEventOnMac(event: Electron.Event, url: string): void {
    deepLinkRequest = url

    event.preventDefault()
    if (windows.main) {
        windows.main.restore()
        windows.main.focus()
        sendDeepLinkRequestToRenderer(deepLinkRequest)
    } else {
        createMainWindow()
    }
}

export function checkWindowArgsForDeepLinkRequest(_e: Electron.Event, args: string[]): void {
    if (args.length > 1) {
        const url = args.find((arg) => arg.startsWith(`${process.env.APP_PROTOCOL}://`))

        if (url) {
            deepLinkRequest = url
            sendDeepLinkRequestToRenderer(deepLinkRequest)
        }
    }
}

function checkForDeepLinkRequest(): void {
    if (deepLinkRequest) {
        sendDeepLinkRequestToRenderer(deepLinkRequest)
    }
}

function clearDeepLinkRequest(): void {
    deepLinkRequest = undefined
}
