import { app, ipcMain, protocol } from 'electron'
import path from 'path'
import { windows } from '../constants/windows.constant'
import { createMainWindow } from '../processes/main.process'

/**
 * Define deep link state
 */
let deepLinkUrl: string | null = null

export function initialiseDeepLinks(): void {
    console.log('initialiseDeepLinks')
    /**
     * Register bloom:// protocol for deep links
     * Set Bloom as the default handler for bloom:// protocol
     * Without registering the scheme as privileged, we can not parse the hostname with new URL()
     */
    protocol.registerSchemesAsPrivileged([
        { scheme: process.env.APP_PROTOCOL, privileges: { secure: true, standard: true } },
    ])
    console.log('registerSchemesAsPrivileged', process.env.APP_PROTOCOL)

    if (process.defaultApp) {
        console.log('process.defaultApp', process.defaultApp)
        if (process.argv.length >= 2) {
            app.setAsDefaultProtocolClient(process.env.APP_PROTOCOL, process.execPath, [path.resolve(process.argv[1])])
            console.log('setAsDefaultProtocolClient', process.env.APP_PROTOCOL, process.execPath, [path.resolve(process.argv[1])])
        }
    } else {
        console.log('no process.defaultApp')
        app.setAsDefaultProtocolClient(process.env.APP_PROTOCOL)
        console.log('setAsDefaultProtocolClient', process.env.APP_PROTOCOL)
    }

    /**
     * macOS proxy deep link event to the wallet application
     */
    app.on('open-url', handleOpenUrl)

    // Deep linking for when the app is not running already (Windows, Linux)
    ipcMain.on('ready-to-show', (event) => {
        console.log('ready-to-show', event)
        if (windows.main) {
            if (process.platform === 'win32' || process.platform === 'linux') {
                checkWindowArgsForDeepLink(event, process.argv)
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
    console.log('handleOpenUrl', url)
    event.preventDefault()
    deepLinkUrl = url
    if (windows.main) {
        windows.main.restore()
        windows.main.focus()
        windows.main.webContents.send('deep-link-request', deepLinkUrl)
    } else {
        createMainWindow()
    }
}

export function checkWindowArgsForDeepLink(_e: Electron.Event, args: string[]): void {
    console.log('checkWindowArgsForDeepLink', _e, args)
    if (args.length > 1) {
        const url = args.find((arg) => arg.startsWith(`${process.env.APP_PROTOCOL}://`))

        if (url) {
            deepLinkUrl = url
            windows.main.webContents.send('deep-link-request', url)
        }
    }
}

function checkDeepLinkRequestExists(): void {
    console.log('checkDeepLinkRequestExists', deepLinkUrl)
    if (deepLinkUrl) {
        windows.main.webContents.send('deep-link-request', deepLinkUrl)
    }
}

function clearDeepLinkRequest(): void {
    console.log('clearDeepLinkRequest', deepLinkUrl)
    deepLinkUrl = null
}
