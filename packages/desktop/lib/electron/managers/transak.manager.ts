import { BrowserWindow, app, shell } from 'electron'
import { windows } from '../constants/windows.constant'
import features from '@features/features'
import { ITransakManager, ITransakWindowData } from '@core/app'
import path from 'path'

export default class TransakManager implements ITransakManager {
    private rect: Electron.Rectangle

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

        const url = this.getUrl(data)
        void windows.transak.loadURL(url)

        windows.transak.webContents.setWindowOpenHandler(({ url }) => {
            void shell.openExternal(url)
            return { action: 'deny' }
        })

        windows.transak.setMenu(null)

        return windows.transak
    }

    public updateTransakBounds(_rect: Electron.Rectangle): void {
        this.rect = _rect
        this.positionWindow()
    }

    public positionWindow(): void {
        try {
            if (windows.transak) {
                const [mainWindowX, mainWindowY] = windows.main.getPosition()
                const [, mainWindowHeight] = windows.main.getSize()
                const [, bodyHeight] = windows.main.getContentSize()

                const menuHeight = mainWindowHeight - bodyHeight

                windows.transak.setBounds({
                    x: Math.floor(mainWindowX + this.rect.x),
                    y: Math.floor(mainWindowY + menuHeight + this.rect.y),
                    height: this.rect.height,
                    width: this.rect.width,
                })
            }
        } catch (error) {
            console.error('positionWindow error', error)
        }
    }

    private getUrl(data: ITransakWindowData): string {
        const { address, currency, service } = data
        const stage = app.isPackaged ? 'production' : 'staging'
        const apiKey = process.env.TRANSAK_API_KEY

        const transakUrl = stage === 'production' ? 'https://global.transak.com' : 'https://global-stg.transak.com'
        return `${transakUrl}/?apiKey=${apiKey}&defaultFiatCurrency=${currency}&walletAddress=${address}&productsAvailed=${service}&cryptoCurrencyCode=IOTA&network=miota&themeColor=7C41C9&hideMenu=true`
    }
}
