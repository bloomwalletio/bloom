const { app, ipcMain, protocol } = require('electron')
const path = require('path')
const { windows } = require('./windows')

/**
 * Define deep link state
 */
let deepLinkUrl = null

export function initialiseDeepLinks() {
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
     * Proxy deep link event to the wallet application
     */
    app.on('open-url', handleOpenUrl)

    app.on('second-instance', checkArgsForDeepLink)

    /**
     * Check if a deep link request/event currently exists and has not been cleared
     */
    ipcMain.on('check-deep-link-request-exists', checkDeepLinkRequestExists)

    /**
     * Clear deep link request/event
     */
    ipcMain.on('clear-deep-link-request', clearDeepLinkRequest)
}

function handleOpenUrl(event, url) {
    event.preventDefault()
    deepLinkUrl = url
    if (windows.main) {
        windows.main.webContents.send('deep-link-params', deepLinkUrl)
        windows.main.webContents.send('deep-link-request')
    }
}

function checkArgsForDeepLink(_e, args) {
    process.stdout.write(`check Args for deep link: \nEvent ${_e} \nArgs: ${args}`)
    if (windows.main) {
        if (args.length > 1) {
            const params = args.find((arg) => arg.startsWith(`${process.env.APP_PROTOCOL}://`))

            if (params) {
                windows.main.webContents.send('deep-link-params', params)
            }
        }
    }
}

function checkDeepLinkRequestExists() {
    if (deepLinkUrl) {
        windows.main.webContents.send('deep-link-params', deepLinkUrl)
    }
}

function clearDeepLinkRequest() {
    deepLinkUrl = null
}
