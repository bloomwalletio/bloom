import { ipcMain } from 'electron'
import * as electronLog from 'electron-log'
import { autoUpdater, CancellationToken, UpdateInfo, ProgressInfo } from 'electron-updater'
import { getOrInitWindow, updateAppVersionDetails } from '../processes/main.process'

interface VersionDetails {
    upToDate: boolean
    newVersion: string
    newVersionReleaseDate: Date
    changelog: string
}

export default class AutoUpdateManager {
    private downloadCancellation?: CancellationToken

    constructor() {
        this.init()
    }

    private init(): void {
        this.removeHandlers()
        ipcMain.handle('update-download', this.updateDownload.bind(this))
        ipcMain.handle('update-cancel', this.updateCancel.bind(this))
        ipcMain.handle('update-install', this.updateInstall.bind(this))
        ipcMain.handle('update-check', this.updateCheck.bind(this))

        autoUpdater.logger = electronLog
        /* eslint-disable @typescript-eslint/ban-ts-comment */
        // @ts-ignore
        autoUpdater.logger.transports.file.level = 'info'
        autoUpdater.autoDownload = false

        autoUpdater.removeAllListeners()
        autoUpdater.on('update-available', this.handleUpdateAvailable.bind(this))
        autoUpdater.on('download-progress', this.handleDownloadProgress.bind(this))
        autoUpdater.on('update-downloaded', this.handleUpdateDownloaded.bind(this))
        autoUpdater.on('error', this.handleError.bind(this))

        void this.updateCheck()
    }

    private handleUpdateAvailable(info: UpdateInfo): void {
        // release notes from GH are HTML so strip tags out
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

    private removeHandlers(): void {
        ipcMain.removeHandler('update-download')
        ipcMain.removeHandler('update-cancel')
        ipcMain.removeHandler('update-install')
        ipcMain.removeHandler('update-check')
    }
}
