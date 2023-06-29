/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules and some
 * polyfilled Node.js functions.
 *
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */

import { ipcRenderer, contextBridge } from 'electron'
import ElectronApi from './electronApi'
import LedgerApi from './ledgerApi'
import * as WalletApi from '@iota/wallet'
import type { CreateAccountPayload, SyncOptions } from '@iota/wallet/out/types'
import fs from 'fs'
import SentryConstructor from '../sentry'
import { CaptureContext } from '@sentry/types'

interface PayloadType {
    accountStartIndex: number
    accountGapLimit: number
    addressGapLimit: number
    syncOptions: SyncOptions
}

const SEND_CRASH_REPORTS = process.argv.includes('--send-crash-reports=true')

let captureException: (exception: unknown, captureContext?: CaptureContext) => string = () => {
    throw new Error('Function not implemented')
}

if (SEND_CRASH_REPORTS) {
    const Sentry = SentryConstructor(true)
    captureException = Sentry.captureException
}

const profileManagers: { [id: string]: WalletApi.AccountManager } = {}

// Hook the error handlers as early as possible
window.addEventListener('error', (event) => {
    if (event.error && event.error.message) {
        void ipcRenderer.invoke('handle-error', '[Preload Context] Error', {
            message: event.error.message,
            stack: event.error.stack,
        })
    } else {
        ipcRenderer.invoke('handle-error', '[Preload Context] Error', event.error || event)
    }
    event.preventDefault()
    console.error(event.error || event)
})

window.addEventListener('unhandledrejection', (event) => {
    void ipcRenderer.invoke('handle-error', '[Preload Context] Unhandled Rejection', event.reason)
    event.preventDefault()
    console.error(event.reason)
})

try {
    if (process.env.STAGE === 'prod') {
        // empty
    } else {
        void ipcRenderer.invoke('get-path', 'userData').then(async (baseDir) => {
            const logDir = `${baseDir}/logs`
            if (!fs.existsSync(logDir)) {
                fs.mkdirSync(logDir)
            }
            const versionDetails = await ipcRenderer.invoke('get-version-details')
            const today = new Date().toISOString().slice(0, 16).replace('T', '-').replace(':', '-')
            const loggerOptions = {
                colorEnabled: true,
                name: `${logDir}/wallet-v${versionDetails.currentVersion}-d${today}.log`,
                levelFilter: 'debug',
                targetExclusions: ['h2', 'hyper', 'rustls', 'message_handler'],
            }
            WalletApi.initLogger(loggerOptions)

            deleteOldLogs(logDir, versionDetails.currentVersion)
        })
    }
} catch (err) {
    console.error('[Preload Context] Error:', err)
}

function deleteOldLogs(path: string, currentVersion: string): void {
    const files = fs.readdirSync(path)
    const dayInMilliSeconds = 1000 * 60 * 60 * 24

    files.forEach((file) => {
        const filePath = path + '/' + file
        const stat = fs.statSync(filePath)

        const isOlderThan30Days = new Date().getTime() - new Date(stat.mtime).getTime() > 30 * dayInMilliSeconds
        const version = file.match(/wallet-v((\w*.)*)-d((\w*.)*).log/)?.[1]
        const isDifferentVersion = version !== currentVersion
        if (isDifferentVersion || isOlderThan30Days) {
            fs.unlinkSync(filePath)
        }
    })
}

try {
    // contextBridge doesn't allow passing custom properties & methods on prototype chain
    // https://www.electronjs.org/docs/latest/api/context-bridge
    // This workaround exposes the classes through factory methods
    // The factory method also copies all the prototype methods to the object so that it gets passed through the bridge
    contextBridge.exposeInMainWorld('__WALLET__API__', {
        createAccountManager(id, options) {
            const manager = new WalletApi.AccountManager(options)
            manager.id = id
            profileManagers[id] = manager
            bindMethodsAcrossContextBridge(WalletApi.AccountManager.prototype, manager)
            return manager
        },
        async createAccount(managerId: string, payload: CreateAccountPayload) {
            const manager = profileManagers[managerId]
            const account = await manager.createAccount(payload)
            bindMethodsAcrossContextBridge(WalletApi.Account.prototype, account)
            return account
        },
        deleteAccountManager(id) {
            if (id && id in profileManagers) {
                delete profileManagers[id]
            }
        },
        async getAccount(managerId: string, index: number) {
            const manager = profileManagers[managerId]
            const account = await manager.getAccount(index)
            bindMethodsAcrossContextBridge(WalletApi.Account.prototype, account)
            return account
        },
        async getAccounts(managerId: string) {
            const manager = profileManagers[managerId]
            const accounts = await manager.getAccounts()
            accounts.forEach((account) => bindMethodsAcrossContextBridge(WalletApi.Account.prototype, account))
            return accounts
        },
        async recoverAccounts(managerId: string, payload: PayloadType) {
            const manager = profileManagers[managerId]
            const accounts = await manager.recoverAccounts(
                payload.accountStartIndex,
                payload.accountGapLimit,
                payload.addressGapLimit,
                payload.syncOptions
            )
            accounts.forEach((account) => bindMethodsAcrossContextBridge(WalletApi.Account.prototype, account))
            return accounts
        },
        migrateStrongholdSnapshotV2ToV3(currentPath, newPath, currentPassword, newPassword) {
            return WalletApi.migrateStrongholdSnapshotV2ToV3(currentPath, newPath, currentPassword, newPassword)
        },
    })
    contextBridge.exposeInMainWorld('__ELECTRON__', ElectronApi)
    contextBridge.exposeInMainWorld('__LEDGER__', LedgerApi)
} catch (err) {
    void ipcRenderer.invoke('handle-error', '[Preload Context] Error', err)
}

function bindMethodsAcrossContextBridge(prototype: unknown, object: object): void {
    const prototypeProperties = Object.getOwnPropertyNames(prototype)
    prototypeProperties.forEach((key) => {
        if (key !== 'constructor') {
            object[key] = object[key].bind(object)
        }
    })
}
