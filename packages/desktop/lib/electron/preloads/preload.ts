/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules and some
 * polyfilled Node.js functions.
 *
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */

import fs from 'fs'
import { ipcRenderer, contextBridge } from 'electron'

import * as IotaSdk from '@iota/sdk'
import type { ILoggerConfig } from '@iota/sdk/out/types'

import ElectronApi from '../apis/electron.api'
import LedgerApi from '../apis/ledger.api'
import WalletApi from '../apis/wallet.api'
import { markEnd, markStart } from '../utils/performance-logger.utils'

const DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24
const DAYS_TO_KEEP_LOGS = 30

// Hook the error handlers as early as possible
window.addEventListener('error', handleErrorEvent)
window.addEventListener('unhandledrejection', handleUnhandledRejectionEvent)

// Triggers the check if a deep link was passed.
// This is required in case the app wasn't open when the user clicks the deep link
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        ipcRenderer.send('dom-content-loaded')
    }, 200)
})

try {
    if (process.env.STAGE !== 'prod') {
        markStart('getVersionAndInitLogger')
        void ipcRenderer.invoke('get-path', 'userData').then(async (baseDir) => {
            const logDir = prepareLogDirectory(baseDir)
            await getVersionAndInitLogger(logDir)
            markEnd('getVersionAndInitLogger')
        })
    }
} catch (err) {
    console.error('[Preload Context] Error:', err)
}

try {
    // contextBridge doesn't allow passing custom properties & methods on prototype chain
    // https://www.electronjs.org/docs/latest/api/context-bridge
    // This workaround exposes the classes through factory methods
    // The factory method also copies all the prototype methods to the object so that it gets passed through the bridge
    markStart('exposeInMainWorld__WALLET__API__')
    contextBridge.exposeInMainWorld('__WALLET__API__', WalletApi)
    markEnd('exposeInMainWorld-__WALLET__API__')
    markStart('exposeInMainWorld__ELECTRON__')
    contextBridge.exposeInMainWorld('__ELECTRON__', ElectronApi)
    markEnd('exposeInMainWorld-__ELECTRON__')
    markStart('exposeInMainWorld__LEDGER__')
    contextBridge.exposeInMainWorld('__LEDGER__', LedgerApi)
    markEnd('exposeInMainWorld-__LEDGER__')
} catch (err) {
    void ipcRenderer.invoke('handle-error', '[Preload Context] Error', err)
}

function handleErrorEvent(event: ErrorEvent): void {
    if (event.error && event.error.message) {
        void ipcRenderer.invoke('handle-error', '[Preload Context] Error', {
            message: event.error.message,
            stack: event.error.stack,
        })
    } else {
        void ipcRenderer.invoke('handle-error', '[Preload Context] Error', event.error || event)
    }
    event.preventDefault()
    console.error(event.error || event)
}

function handleUnhandledRejectionEvent(event: PromiseRejectionEvent): void {
    void ipcRenderer.invoke('handle-error', '[Preload Context] Unhandled Rejection', event.reason)
    event.preventDefault()
    console.error(event.reason)
}

function prepareLogDirectory(baseDir: string): string {
    const logDir = `${baseDir}/logs`
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir)
    }
    return logDir
}

async function getVersionAndInitLogger(logDir: string): Promise<void> {
    const versionDetails = await ipcRenderer.invoke('get-version-details')
    const today = new Date().toISOString().slice(0, 16).replace('T', '-').replace(':', '-')
    const loggerOptions: ILoggerConfig = {
        colorEnabled: true,
        name: `${logDir}/wallet-v${versionDetails.currentVersion}-d${today}.log`,
        levelFilter: 'debug',
        targetExclusions: ['h2', 'hyper', 'rustls', 'message_handler'],
    }
    IotaSdk.initLogger(loggerOptions)

    deleteOldLogs(logDir, versionDetails.currentVersion)
}

function deleteOldLogs(path: string, currentVersion: string): void {
    const files = fs.readdirSync(path)
    files.forEach((file) => {
        const filePath = path + '/' + file
        const stat = fs.statSync(filePath)

        const isOlderThan30Days =
            new Date().getTime() - new Date(stat.mtime).getTime() > DAYS_TO_KEEP_LOGS * DAY_IN_MILLISECONDS
        const version = file.match(/wallet-v([\w.]+)-d([\w.-]+).log/)?.[1]

        const isDifferentVersion = version !== currentVersion
        if (isDifferentVersion || isOlderThan30Days) {
            fs.unlinkSync(filePath)
        }
    })
}
