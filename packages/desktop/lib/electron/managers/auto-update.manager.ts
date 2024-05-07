import { app, ipcMain } from 'electron'
import * as electronLog from 'electron-log'
import { CancellationToken, ProgressInfo, UpdateInfo, autoUpdater } from 'electron-updater'

interface IVersionDetails {
    upToDate: boolean
    currentVersion: string
    newVersion?: string
    newVersionReleaseDate?: Date
    changelog: string
}

export default class AutoUpdateManager implements IVersionDetails {
    private window: Electron.BrowserWindow
    private downloadCancellation?: CancellationToken
    public upToDate: boolean = true
    public currentVersion: string
    public newVersion?: string
    public newVersionReleaseDate?: Date
    public changelog: string = ''

    constructor(window: Electron.BrowserWindow) {
        this.window = window
        this.currentVersion = app.getVersion()
        this.init()
    }

    private init(): void {
        this.removeHandlers()
        ipcMain.handle('update-download', this.updateDownload.bind(this))
        ipcMain.handle('update-cancel', this.updateCancel.bind(this))
        ipcMain.handle('update-install', this.updateInstall.bind(this))
        ipcMain.handle('update-check', this.updateCheck.bind(this))
        ipcMain.handle('get-version-details', this.getVersionDetails.bind(this))

        autoUpdater.logger = electronLog
        /* eslint-disable @typescript-eslint/ban-ts-comment */
        // @ts-expect-error
        autoUpdater.logger.transports.file.level = 'info'
        autoUpdater.autoDownload = false

        autoUpdater.removeAllListeners()
        autoUpdater.on('update-available', this.handleUpdateAvailable.bind(this))
        autoUpdater.on('download-progress', this.handleDownloadProgress.bind(this))
        autoUpdater.on('update-downloaded', this.handleUpdateDownloaded.bind(this))
        autoUpdater.on('error', this.handleError.bind(this))

        void this.updateCheck()
    }

    public getVersionDetails(): IVersionDetails {
        return {
            upToDate: this.upToDate,
            currentVersion: this.currentVersion,
            newVersion: this.newVersion,
            newVersionReleaseDate: this.newVersionReleaseDate,
            changelog: this.changelog,
        }
    }

    private updateAppVersionDetails(versionDetails: Partial<IVersionDetails>): void {
        this.upToDate = versionDetails.upToDate ?? this.upToDate
        this.newVersion = versionDetails.newVersion ?? this.newVersion
        this.newVersionReleaseDate = versionDetails.newVersionReleaseDate ?? this.newVersionReleaseDate
        this.changelog = versionDetails.changelog ?? this.changelog

        this.window?.webContents.send('version-details', this.getVersionDetails())
    }

    private handleUpdateAvailable(info: UpdateInfo): void {
        // release notes from GH are HTML so strip tags out
        let releaseNotes = info.releaseNotes || ''
        if (typeof releaseNotes === 'string') {
            releaseNotes = releaseNotes.replace(/<[^>]*>?/gm, '')
        }

        this.updateAppVersionDetails({
            upToDate: false,
            newVersion: info.version,
            newVersionReleaseDate: new Date(info.releaseDate),
            changelog: releaseNotes.toString(),
        })
    }

    private handleDownloadProgress(progressObj: ProgressInfo): void {
        this.window?.webContents.send('version-progress', progressObj)
    }

    private handleUpdateDownloaded(info: UpdateInfo): void {
        this.window?.webContents.send('version-complete', info)
    }

    private handleError(err: Error): void {
        this.downloadCancellation = undefined
        this.window?.webContents.send('version-error', err)
    }

    private updateDownload(): void {
        if (!this.downloadCancellation) {
            this.downloadCancellation = new CancellationToken()
            void autoUpdater.downloadUpdate(this.downloadCancellation)
        }
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
        ipcMain.removeHandler('get-version-details')
    }
}
