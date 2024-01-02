import { ensureDirectoryExistence } from '@desktop/electron/utils/file-system.utils'
import { getOrInitWindow } from '../processes/main.process'
import { app, ipcMain, IpcMainInvokeEvent } from 'electron'
import { download } from 'electron-dl'

interface DownloadItems {
    [nftId: string]: Electron.DownloadItem
}

export default class NftDownloadManager {
    private downloadItems: DownloadItems = {}

    constructor() {
        this.init()
    }

    private init(): void {
        ipcMain.removeHandler('nft-download')
        ipcMain.handle('nft-download', this.handleNftDownload.bind(this))

        ipcMain.removeHandler('cancel-nft-download')
        ipcMain.handle('cancel-nft-download', this.handleNftDownloadCancel.bind(this))
    }

    private async handleNftDownload(
        _event: IpcMainInvokeEvent,
        url: string,
        destination: string,
        nftId: string,
        accountIndex: number
    ): Promise<void> {
        const userPath = app.getPath('userData')
        const parentDirectory = app.isPackaged ? userPath : __dirname
        const directory = `${parentDirectory}/__storage__/${destination}`
        ensureDirectoryExistence(directory)
        const main = getOrInitWindow('main')

        try {
            await download(main, url, {
                directory,
                filename: 'original',
                saveAs: false,
                showBadge: true,
                showProgressBar: true,
                onCompleted: () => {
                    delete this.downloadItems[nftId]
                    main.webContents.send('nft-download-done', { nftId, accountIndex })
                },
                onCancel: () => {
                    delete this.downloadItems[nftId]
                    main.webContents.send('nft-download-interrupted', { nftId, accountIndex })
                },
                onStarted: (item) => (this.downloadItems[nftId] = item),
            })
        } catch (error) {
            delete this.downloadItems[nftId]
            main.webContents.send('nft-download-interrupted', { nftId, accountIndex })
        }
    }

    private handleNftDownloadCancel(_event: IpcMainInvokeEvent, nftId: string): void {
        const downloadItem = this.downloadItems[nftId]
        downloadItem?.cancel()
    }
}
