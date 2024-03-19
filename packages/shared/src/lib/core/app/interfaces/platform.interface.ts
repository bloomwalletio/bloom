import { IError } from '@core/error/interfaces'

import { IDeepLinkManager, INotificationManager, IPincodeManager } from './managers'
import { IAppSettings } from './app-settings.interface'
import { IAppVersionDetails } from './app-version-details.interface'
import { IPlatformEventMap } from './platform-event-map.interface'
import { AppTheme } from '../enums'
import { ITransakWindowData } from './transak-window-data.interface'

export interface IPlatform {
    getStrongholdBackupDestination(defaultPath: string): Promise<string | null>
    saveStrongholdBackup({ allowAccess }: { allowAccess: boolean }): Promise<void>
    exportTransactionHistory(defaultPath: string, contents: string): Promise<string | null>
    getUserDataPath(): Promise<string>
    getDiagnostics(): Promise<{ label: string; value: string }[]>
    getMachineId(): Promise<string>
    updateAppSettings(settings: Partial<IAppSettings>): Promise<void>
    removeProfileFolder(profilePath: string): Promise<void>
    renameProfileFolder(oldPath: string, newPath: string): Promise<void>
    listProfileFolders(profileStoragePath: string): Promise<string[]>
    updateMenu(attribute: string, value: unknown): void
    popupMenu(): void
    maximize(): Promise<boolean>
    minimize(): void
    close(): void
    isMaximized(): Promise<boolean>
    saveRecoveryKit(kitData: ArrayBuffer): Promise<void>
    openUrl(url: string): void
    copyFile(sourceFilePath: string, destinationFilePath: string): Promise<void>
    deleteFile(filePath: string): Promise<void>
    downloadNft(url: string, destinationFilePath: string, nftId: string): Promise<void>
    cancelNftDownload(nftId: string): Promise<void>
    checkIfFileExists(filePath: string): Promise<boolean>

    DeepLinkManager: IDeepLinkManager | undefined
    NotificationManager: INotificationManager | undefined
    PincodeManager: IPincodeManager | undefined

    focusWindow(): Promise<void>
    getAppVersionDetails(): Promise<IAppVersionDetails>

    checkForAppUpdate(): Promise<void>
    installAppUpdate(): Promise<void>
    cancelAppUpdateDownload(): Promise<void>
    downloadAppUpdate(): Promise<void>

    unhandledException(title: string, err: IError | unknown): Promise<void>

    onEvent<K extends keyof IPlatformEventMap>(eventName: K, callback: (param: IPlatformEventMap[K]) => void): void
    removeListenersForEvent<K extends keyof IPlatformEventMap>(eventName: K): void

    isFeatureFlagEnabled(keyPath: string): boolean
    trackEvent(eventName: string, eventProperties?: Record<string, unknown>): void

    getLanguageCode(): Promise<string>

    getTheme(): Promise<AppTheme>
    updateTheme(theme: AppTheme): Promise<void>
    shouldBeDarkMode(): Promise<boolean>

    startLedgerProcess(): void
    killLedgerProcess(): void

    openTransak(data: ITransakWindowData): Promise<void>
    closeTransak(): Promise<void>
    hideTransak(): Promise<void>
    showTransak(): Promise<void>
    updateTransakBounds(rect: { x: number; y: number; height: number; width: number }): Promise<void>
}
