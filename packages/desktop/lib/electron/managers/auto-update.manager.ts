import { ipcMain } from 'electron'
import { autoUpdater, CancellationToken, UpdateInfo, ProgressInfo } from 'electron-updater'
import * as electronLog from 'electron-log'
import { getOrInitWindow, updateAppVersionDetails } from '../main'

interface VersionDetails {
    upToDate: boolean
    newVersion: string
    newVersionReleaseDate: Date
    changelog: string
}

export default class AutoUpdateManager {
    private downloadCancellation?: CancellationToken
    private ipcHandlersRegistered = false

    constructor() {
        this.init()
    }

    private init(): void {
        if (!this.ipcHandlersRegistered) {
            ipcMain.handle('update-download', this.updateDownload.bind(this))
            ipcMain.handle('update-cancel', this.updateCancel.bind(this))
            ipcMain.handle('update-install', this.updateInstall.bind(this))
            ipcMain.handle('update-check', this.updateCheck.bind(this))
            this.ipcHandlersRegistered = true
        }

        /* eslint-disable @typescript-eslint/ban-ts-comment */
        // @ts-ignore
        autoUpdater.logger.transports.file.level = 'info'
        autoUpdater.logger = electronLog
        autoUpdater.autoDownload = false

        autoUpdater.on('update-available', this.handleUpdateAvailable.bind(this))
        autoUpdater.on('download-progress', this.handleDownloadProgress.bind(this))
        autoUpdater.on('update-downloaded', this.handleUpdateDownloaded.bind(this))
        autoUpdater.on('error', this.handleError.bind(this))

        void this.updateCheck()
    }

    private handleUpdateAvailable(info: UpdateInfo): void {
        let releaseNotes = info.releaseNotes || ''
        if (typeof releaseNotes === 'string') {
            releaseNotes = releaseNotes.replace(/<[^>]*>?/gm, '')
        }
        const versionDetails: VersionDetails = {
            upToDate: false,
            newVersion: info.version,
            newVersionReleaseDate: new Date(info.releaseDate),
            changelog: releaseNotes.toString(),
        }

        updateAppVersionDetails(versionDetails)
    }

    private handleDownloadProgress(progressObj: ProgressInfo): void {
        getOrInitWindow('main').webContents.send('version-progress', progressObj)
    }

    private handleUpdateDownloaded(info: UpdateInfo): void {
        getOrInitWindow('main').webContents.send('version-complete', info)
    }

    private handleError(err: Error): void {
        getOrInitWindow('main').webContents.send('version-error', err)
    }

    private updateDownload(): void {
        this.downloadCancellation = new CancellationToken()
        void autoUpdater.downloadUpdate(this.downloadCancellation)
    }

    private updateCancel(): void {
        if (this.downloadCancellation) {
            this.downloadCancellation.cancel()
            this.downloadCancellation = undefined
        }
    }

    private updateInstall(): void {
        autoUpdater.quitAndInstall()
    }

    private async updateCheck(): Promise<void> {
        try {
            await autoUpdater.checkForUpdates()
        } catch (error) {
            console.error(error)
        }
    }
}
