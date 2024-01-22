import { BrowserWindow, app } from 'electron'
import { windows } from '../constants/windows.constant'
import features from '@features/features'
import { ITransakManager, ITransakWindowData } from '@core/app'
import path from 'path'

export default class TransakManager implements ITransakManager {
    private rect: { x: number; y: number; width: number; height: number }

    private htmlPath = app.isPackaged
        ? path.join(app.getAppPath(), '/public/transak.html')
        : path.join(__dirname, '../transak.html')
    private preloadPath = app.isPackaged
        ? path.join(app.getAppPath(), '/public/build/transak.preload.js')
        : path.join(__dirname, 'transak.preload.js')

    public closeWindow(): void {
        if (windows.transak) {
            windows.transak.close()
            windows.transak = null
        }
    }

    public minimizeWindow(): void {
        windows.transak?.minimize()
    }

    public restoreWindow(): void {
        windows.transak?.restore()
    }

    public openWindow(data: ITransakWindowData): BrowserWindow {
        if (windows.transak !== null) {
            return windows.transak
        }

        this.rect = { x: 0, y: 0, width: 480, height: 613 }

        windows.transak = new BrowserWindow({
            parent: windows.main,
            width: 480,
            height: 613,
            useContentSize: true,
            titleBarStyle: 'hidden',
            frame: false,
            show: true,
            fullscreenable: false,
            transparent: true,
            movable: false,
            resizable: false,
            minimizable: false,
            skipTaskbar: true,
            acceptFirstMouse: true,
            hasShadow: false,
            thickFrame: false,
            roundedCorners: false,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                disableBlinkFeatures: 'Auxclick',
                webviewTag: false,
                enableWebSQL: false,
                devTools: !app.isPackaged || features?.electron?.developerTools?.enabled,
                preload: this.preloadPath,
            },
        })

        if (process.platform === 'darwin') {
            windows.transak.setWindowButtonVisibility(false)
        }

        windows.main.on('move', () => this.positionWindow())

        windows.transak.once('closed', () => {
            windows.transak = null
        })

        windows.transak.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
            if (permission === 'media') {
                callback(true)
            } else {
                callback(false)
            }
        })

        void windows.transak.loadFile(this.htmlPath)
        windows.transak.webContents.on('did-finish-load', () => {
            const _data = {
                currency: data.currency,
                address: data.address,
                stage: app.isPackaged ? 'production' : 'staging',
                apiKey: process.env.TRANSAK_API_KEY,
                service: data.service,
            }
            windows.transak.webContents.send('transak-data', _data)
        })

        windows.transak.setMenu(null)

        return windows.transak
    }

    public updateTransakBounds(_rect: { x: number; y: number; height: number; width: number }): void {
        this.rect = _rect
        this.positionWindow()
    }

    public positionWindow(): void {
        try {
            if (windows.transak) {
                const [mainWindowX, mainWindowY] = windows.main.getPosition()
                windows.transak.setBounds({
                    x: Math.floor(mainWindowX + this.rect.x),
                    y: Math.floor(mainWindowY + this.rect.y),
                    height: this.rect.height,
                    width: this.rect.width,
                })
            }
        } catch (error) {
            console.error('positionWindow error', error)
        }
    }
}
