import { ipcRenderer } from 'electron'
import fs from 'fs'

import features from '@features/features'
import { MENU_STATE } from '../menus/menu-state.constant'
import DeepLinkManager from '../managers/deep-link.manager'
import NotificationManager from '../managers/notification.manager'
import PincodeManager from '../managers/pincode.manager'
import { bindMethodsAcrossContextBridge } from '../utils/context-bridge.utils'

import type { IAppSettings } from '@core/app/interfaces'
import type { IFeatureFlag } from '@lib/features/interfaces'

let activeProfileId = null
const eventListeners = {}

export default {
    updateAppSettings(settings: Partial<IAppSettings>): Promise<void> {
        return ipcRenderer.invoke('update-app-settings', settings)
    },
    getActiveProfile(): string {
        return activeProfileId
    },
    updateActiveProfile(id: string): void {
        activeProfileId = id
    },
    async renameProfileFolder(oldPath: fs.PathLike, newPath: fs.PathLike): Promise<unknown> {
        return ipcRenderer.invoke('get-path', 'userData').then((userDataPath) => {
            if ((oldPath as string).startsWith(userDataPath)) {
                try {
                    fs.renameSync(oldPath, newPath)
                } catch (err) {
                    console.error(err)
                }
            }
        })
    },
    async removeProfileFolder(profilePath: fs.PathLike): Promise<unknown> {
        return ipcRenderer.invoke('get-path', 'userData').then((userDataPath) => {
            // Check that the removing profile path matches the user data path
            // so that we don't try and remove things outside our scope
            if ((profilePath as string).startsWith(userDataPath)) {
                try {
                    // Sometime the DB can still be locked while it is flushing
                    // so retry if we receive a busy exception
                    fs.rmdirSync(profilePath, { recursive: true, maxRetries: 30, retryDelay: 500 })
                } catch (err) {
                    console.error(err)
                }
            }
        })
    },
    async listProfileFolders(profileStoragePath: fs.PathLike): Promise<unknown> {
        return ipcRenderer.invoke('get-path', 'userData').then((userDataPath) => {
            // Check that the profile path matches the user data path
            // so that we don't try and remove things outside our scope
            if ((profileStoragePath as string).startsWith(userDataPath)) {
                try {
                    // Get a list of all the profile folders in storage
                    return fs.readdirSync(profileStoragePath)
                } catch (err) {
                    if (err.code === 'ENOENT') {
                        // The __storage__ directory doesn't exist
                        return []
                    }
                    console.error(err)
                }
            }
        })
    },
    DeepLinkManager: bindMethodsAcrossContextBridge(DeepLinkManager, new DeepLinkManager()),
    NotificationManager: bindMethodsAcrossContextBridge(NotificationManager, new NotificationManager()),
    PincodeManager: bindMethodsAcrossContextBridge(PincodeManager, new PincodeManager()),
    async getStrongholdBackupDestination(defaultPath: unknown): Promise<unknown> {
        return ipcRenderer
            .invoke('show-save-dialog', {
                properties: ['createDirectory', 'showOverwriteConfirmation'],
                defaultPath,
                filters: [{ name: 'Stronghold Files', extensions: ['stronghold'] }],
            })
            .then((result) => {
                if (result.canceled) {
                    return null
                }

                return result.filePath
            })
    },
    saveStrongholdBackup(): null {
        return null
    },
    async exportTransactionHistory(defaultPath: unknown, contents: string | NodeJS.ArrayBufferView): Promise<unknown> {
        return ipcRenderer
            .invoke('show-save-dialog', {
                properties: ['createDirectory', 'showOverwriteConfirmation'],
                defaultPath,
                filters: [{ name: 'CSV Files', extensions: ['csv'] }],
            })
            .then((result) => {
                if (result.canceled) {
                    return null
                }
                return new Promise((resolve, reject) => {
                    try {
                        fs.writeFileSync(result.filePath, contents)
                        resolve(result.filePath)
                    } catch (err) {
                        reject(err)
                    }
                })
            })
    },
    getUserDataPath(): Promise<unknown> {
        return ipcRenderer.invoke('get-path', 'userData')
    },
    getDiagnostics(): Promise<unknown> {
        return ipcRenderer.invoke('diagnostics')
    },
    getMachineId(): Promise<unknown> {
        return ipcRenderer.invoke('get-machine-id')
    },
    downloadAppUpdate(): Promise<unknown> {
        return ipcRenderer.invoke('update-download')
    },
    cancelAppUpdateDownload(): Promise<unknown> {
        return ipcRenderer.invoke('update-cancel')
    },
    installAppUpdate(): Promise<unknown> {
        return ipcRenderer.invoke('update-install')
    },
    checkForAppUpdate(): Promise<unknown> {
        return ipcRenderer.invoke('update-check')
    },
    getAppVersionDetails(): Promise<unknown> {
        return ipcRenderer.invoke('get-version-details')
    },
    updateMenu(attribute: string, value: unknown): Promise<unknown> {
        if (Object.keys(MENU_STATE).includes(attribute)) {
            return ipcRenderer.invoke('menu-update', {
                [attribute]: value,
            })
        }
    },
    popupMenu(): Promise<unknown> {
        return ipcRenderer.invoke('menu-popup')
    },
    minimize(): Promise<unknown> {
        return ipcRenderer.invoke('minimize')
    },
    maximize(): Promise<unknown> {
        return ipcRenderer.invoke('maximize')
    },
    isMaximized(): Promise<unknown> {
        return ipcRenderer.invoke('isMaximized')
    },
    close(): Promise<unknown> {
        return ipcRenderer.invoke('close')
    },
    downloadNft(url: unknown, destinationFilePath: unknown, nftId: unknown, accountIndex: unknown): Promise<unknown> {
        return ipcRenderer.invoke('nft-download', url, destinationFilePath, nftId, accountIndex)
    },
    cancelNftDownload(nftId: unknown): Promise<unknown> {
        return ipcRenderer.invoke('cancel-nft-download', nftId)
    },
    checkIfFileExists(filePath: unknown): Promise<unknown> {
        return ipcRenderer.invoke('check-if-file-exists', filePath)
    },
    openUrl(url: unknown): Promise<unknown> {
        return ipcRenderer.invoke('open-external-url', url)
    },
    copyFile(sourceFilePath: unknown, destinationFilePath: unknown): Promise<unknown> {
        return ipcRenderer.invoke('copy-file', sourceFilePath, destinationFilePath)
    },
    deleteFile(filePath: unknown): Promise<unknown> {
        return ipcRenderer.invoke('delete-file', filePath)
    },
    unhandledException(errorType: unknown, error: unknown): Promise<unknown> {
        return ipcRenderer.invoke('handle-error', errorType, error)
    },
    onEvent(event: string, callback: unknown): void {
        let listeners = eventListeners[event]
        if (!listeners) {
            listeners = eventListeners[event] = []
        }
        listeners.push(callback)
        ipcRenderer.removeAllListeners(event)
        ipcRenderer.on(event, (_e, args) => {
            listeners.forEach((call: (arg0: unknown) => void) => {
                call(args)
            })
        })
    },
    removeListenersForEvent(event: string): Electron.IpcRenderer {
        eventListeners[event] = []
        return ipcRenderer.removeAllListeners(event)
    },
    async saveRecoveryKit(recoverKitData: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>): Promise<unknown> {
        return ipcRenderer
            .invoke('show-save-dialog', {
                properties: ['createDirectory', 'showOverwriteConfirmation'],
                defaultPath: 'firefly-recovery-kit.pdf',
                filters: [
                    { name: 'Pdf Document', extensions: ['pdf'] },
                    { name: 'All Files', extensions: ['*'] },
                ],
            })
            .then((result) => {
                if (result.canceled) {
                    return
                }

                try {
                    fs.writeFileSync(result.filePath, Buffer.from(recoverKitData))
                } catch (err) {
                    console.error(err)
                }
            })
    },
    trackEvent(eventName: string, eventProperties: unknown): Promise<unknown> {
        return ipcRenderer.invoke('track-event', eventName, eventProperties)
    },
    isFeatureFlagEnabled(keyPath: string): boolean {
        const feature = keyPath
            ?.split('.')
            .reduce(
                (prev: { [x: string]: unknown }, cur: string | number) => prev && prev[cur],
                features
            ) as IFeatureFlag
        return feature?.enabled ?? false
    },
    updateTheme(theme: string): Promise<void> {
        return ipcRenderer.invoke('update-theme', theme)
    },
    startLedgerProcess(): void {
        return ipcRenderer.send('start-ledger-process')
    },
    killLedgerProcess(): void {
        return ipcRenderer.send('kill-ledger-process')
    },
}
