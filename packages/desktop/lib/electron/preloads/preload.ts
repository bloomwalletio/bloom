/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules and some
 * polyfilled Node.js functions.
 *
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */

import { ipcRenderer, contextBridge } from 'electron'

import ElectronApi from '../apis/electron.api'
import LedgerApi from '../apis/ledger.api'
import WalletApi from '../apis/wallet.api'

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
    // contextBridge doesn't allow passing custom properties & methods on prototype chain
    // https://www.electronjs.org/docs/latest/api/context-bridge
    // This workaround exposes the classes through factory methods
    // The factory method also copies all the prototype methods to the object so that it gets passed through the bridge

    contextBridge.exposeInMainWorld('__WALLET__API__', WalletApi)
    contextBridge.exposeInMainWorld('__ELECTRON__', ElectronApi)
    contextBridge.exposeInMainWorld('__LEDGER__', LedgerApi)
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
