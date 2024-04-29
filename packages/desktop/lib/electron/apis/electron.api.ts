import { ipcRenderer } from 'electron'
import fs from 'fs'

import features from '@features/features'
import { MENU_STATE } from '../menus/menu-state.constant'
import DeepLinkManager from '../managers/deep-link.manager'
import NotificationManager from '../managers/notification.manager'
import PincodeManager from '../managers/pincode.manager'
import { bindMethodsAcrossContextBridge } from '../utils/context-bridge.utils'

import type { IAppSettings, IAppVersionDetails, IPlatform, ITransakWindowData } from '@core/app/interfaces'
import type { IFeatureFlag } from '@lib/features/interfaces'
import { AppTheme } from '@core/app/enums'
import { KeyValue } from '@ui/types'
import { ThirdPartyAppName } from '@auxiliary/third-party/enums/third-party-app-name.enum'

const eventListeners = {}

const electronApi: IPlatform = {
    updateAppSettings(settings: Partial<IAppSettings>): Promise<void> {
        return ipcRenderer.invoke('update-app-settings', settings)
    },
    async removeProfileFolder(profilePath: fs.PathLike): Promise<void> {
        const userDataPath = await ipcRenderer.invoke('get-path', 'userData')
        // Check that the removing profile path matches the user data path
        // so that we don't try and remove things outside our scope
        if ((profilePath as string).startsWith(userDataPath)) {
            try {
                // Sometime the DB can still be locked while it is flushing
                // so retry if we receive a busy exception
                await fs.promises.rmdir(profilePath, { recursive: true, maxRetries: 30, retryDelay: 500 })
            } catch (err) {
                console.error(err)
            }
        }
    },
    async listProfileFolders(profileStoragePath: fs.PathLike): Promise<string[]> {
        return ipcRenderer.invoke('get-path', 'userData').then((userDataPath) => {
            // Check that the profile path matches the user data path
            // so that we don't try and remove things outside our scope
            if ((profileStoragePath as string).startsWith(userDataPath)) {
                try {
                    // Get a list of all the profile folders in storage
                    return fs.readdirSync(profileStoragePath)
                } catch (err) {
                    if ((err as { code: string }).code === 'ENOENT') {
                        // The __storage__ directory doesn't exist
                        return []
                    }
                    console.error(err)
                }
            }
            return []
        })
    },

    DeepLinkManager: bindMethodsAcrossContextBridge(DeepLinkManager, new DeepLinkManager()),
    NotificationManager: bindMethodsAcrossContextBridge(NotificationManager, new NotificationManager()),
    PincodeManager: bindMethodsAcrossContextBridge(PincodeManager, new PincodeManager()),

    async getStrongholdBackupDestination(defaultPath: unknown): Promise<string | null> {
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
    async exportTransactionHistory(
        defaultPath: unknown,
        contents: string | NodeJS.ArrayBufferView
    ): Promise<string | null> {
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
    getUserDataPath(): Promise<string> {
        return ipcRenderer.invoke('get-path', 'userData')
    },
    getDiagnostics(): Promise<{ label: string; value: string }[]> {
        return ipcRenderer.invoke('diagnostics')
    },
    getMachineId(): Promise<string> {
        return ipcRenderer.invoke('get-machine-id')
    },
    downloadAppUpdate(): Promise<void> {
        return ipcRenderer.invoke('update-download')
    },
    cancelAppUpdateDownload(): Promise<void> {
        return ipcRenderer.invoke('update-cancel')
    },
    installAppUpdate(): Promise<void> {
        return ipcRenderer.invoke('update-install')
    },
    checkForAppUpdate(): Promise<void> {
        return ipcRenderer.invoke('update-check')
    },
    focusWindow(): Promise<void> {
        return ipcRenderer.invoke('focus-window')
    },
    getAppVersionDetails(): Promise<IAppVersionDetails> {
        return ipcRenderer.invoke('get-version-details')
    },
    updateMenu(attribute: string, value: unknown): Promise<void> | undefined {
        if (Object.keys(MENU_STATE).includes(attribute)) {
            return ipcRenderer.invoke('menu-update', {
                [attribute]: value,
            })
        }
    },
    popupMenu(): Promise<void> {
        return ipcRenderer.invoke('menu-popup')
    },
    minimize(): Promise<void> {
        return ipcRenderer.invoke('minimize')
    },
    maximize(): Promise<boolean> {
        return ipcRenderer.invoke('maximize')
    },
    isMaximized(): Promise<boolean> {
        return ipcRenderer.invoke('isMaximized')
    },
    close(): Promise<void> {
        return ipcRenderer.invoke('close')
    },
    downloadNft(url: string, destinationFilePath: string, nftId: string): Promise<void> {
        return ipcRenderer.invoke('nft-download', url, destinationFilePath, nftId)
    },
    cancelNftDownload(nftId: string): Promise<void> {
        return ipcRenderer.invoke('cancel-nft-download', nftId)
    },
    checkIfFileExists(filePath: string): Promise<boolean> {
        return ipcRenderer.invoke('check-if-file-exists', filePath)
    },
    openUrl(url: unknown): Promise<void> {
        return ipcRenderer.invoke('open-external-url', url)
    },
    copyFile(sourceFilePath: unknown, destinationFilePath: unknown): Promise<void> {
        return ipcRenderer.invoke('copy-file', sourceFilePath, destinationFilePath)
    },
    deleteFile(filePath: unknown): Promise<void> {
        return ipcRenderer.invoke('delete-file', filePath)
    },
    unhandledException(errorType: unknown, error: unknown): Promise<void> {
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
    async saveRecoveryKit(recoverKitData: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>): Promise<void> {
        return ipcRenderer
            .invoke('show-save-dialog', {
                properties: ['createDirectory', 'showOverwriteConfirmation'],
                defaultPath: 'bloom-recovery-kit.pdf',
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
    async saveTextInFile(fileName: string, extension: string, content: string): Promise<void> {
        return new Promise((resolve, reject) => {
            void ipcRenderer
                .invoke('show-save-dialog', {
                    properties: ['createDirectory', 'showOverwriteConfirmation'],
                    defaultPath: `${fileName}.${extension}`,
                    filters: [
                        { name: `${extension.toUpperCase()} documents`, extensions: [extension] },
                        { name: 'All Files', extensions: ['*'] },
                    ],
                })
                .then((result) => {
                    if (result.canceled) {
                        reject('Canceled by user')
                        return
                    }

                    try {
                        fs.writeFileSync(result.filePath, content)
                        resolve()
                    } catch (err) {
                        reject(err)
                    }
                })
                .catch((err) => reject(err))
        })
    },
    trackEvent(eventName: string, eventProperties?: unknown): Promise<void> | undefined {
        if (features.analytics.enabled) {
            return ipcRenderer.invoke('track-event', eventName, eventProperties)
        }
    },
    isFeatureFlagEnabled(keyPath: string): boolean {
        const feature = keyPath
            ?.split('.')
            .reduce((prev, cur) => prev && prev[cur], features) as unknown as IFeatureFlag
        return feature?.enabled ?? false
    },
    getTheme(): Promise<AppTheme> {
        return ipcRenderer.invoke('get-theme')
    },
    updateTheme(theme: string): Promise<void> {
        return ipcRenderer.invoke('update-theme', theme)
    },
    shouldBeDarkMode(): Promise<boolean> {
        return ipcRenderer.invoke('should-be-dark-mode')
    },
    startLedgerProcess(): void {
        return ipcRenderer.send('start-ledger-process')
    },
    killLedgerProcess(): void {
        return ipcRenderer.send('kill-ledger-process')
    },
    openTransak(data: ITransakWindowData): Promise<void> {
        return ipcRenderer.invoke('open-transak', data)
    },
    closeTransak(): Promise<void> {
        return ipcRenderer.invoke('close-transak')
    },
    hideTransak(): Promise<void> {
        return ipcRenderer.invoke('hide-transak')
    },
    showTransak(): Promise<void> {
        return ipcRenderer.invoke('show-transak')
    },
    updateTransakBounds(rect: Electron.Rectangle): Promise<void> {
        return ipcRenderer.invoke('update-transak-bounds', rect)
    },
    getThirdPartyApps(): Promise<ThirdPartyAppName[]> {
        return ipcRenderer.invoke('get-third-party-apps')
    },
    async getThirdPartyData(appName: string): Promise<Record<number, KeyValue<string>> | undefined> {
        return ipcRenderer.invoke('get-data-from-third-party-app', appName)
    },
    copyProfileDirectory(appName: string, profileId: string): Promise<void> {
        return ipcRenderer.invoke('copy-third-party-profile', appName, profileId)
    },
}

export default electronApi
