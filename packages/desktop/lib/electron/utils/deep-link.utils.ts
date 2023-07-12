import { app, ipcMain, protocol } from 'electron'
import path from 'path'
import { windows } from '../constants/windows.constant'

/**
 * Define deep link state
 */
let deepLinkUrl: string | null = null

export function initialiseDeepLinks(): void {
    /**
     * Register bloom:// protocol for deep links
     * Set Bloom as the default handler for bloom:// protocol
     * Without registering the scheme as privileged, we can not parse the hostname with new URL()
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
     * macOS proxy deep link event to the wallet application
     */
    app.on('open-url', handleOpenUrl)

    // Deep linking for when the app is not running already (Windows, Linux)
    ipcMain.on('ready-to-show', (event) => {
        if (windows.main) {
            // TODO: check if required: windows.main.show()
            if (process.platform === 'win32' || process.platform === 'linux') {
                checkArgsForDeepLink(event, process.argv)
            }
        }
    })

    /**
     * Check if a deep link request/event currently exists and has not been cleared
     */
    ipcMain.on('check-deep-link-request-exists', checkDeepLinkRequestExists)

    /**
     * Clear deep link request/event
     */
    ipcMain.on('clear-deep-link-request', clearDeepLinkRequest)
}

function handleOpenUrl(event: Electron.Event, url: string): void {
    event.preventDefault()
    deepLinkUrl = url
    if (windows.main) {
        windows.main.webContents.send('deep-link-request', deepLinkUrl)
    }
}

export function checkArgsForDeepLink(_e: Electron.Event, args: string[]): void {
    if (args.length > 1) {
        const url = args.find((arg) => arg.startsWith(`${process.env.APP_PROTOCOL}://`))

        if (url) {
            deepLinkUrl = url
            windows.main.webContents.send('deep-link-request', url)
        }
    }
}

function checkDeepLinkRequestExists(): void {
    if (deepLinkUrl) {
        windows.main.webContents.send('deep-link-request', deepLinkUrl)
    }
}

function clearDeepLinkRequest(): void {
    deepLinkUrl = null
}
