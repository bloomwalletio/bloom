import { BrowserWindow, app } from 'electron'
import { windows } from '../constants/windows.constant'
import features from '@features/features'
import { ITransakManager, ITransakWindowData } from '@core/app'
import path from 'path'

const SIDEBAR_WIDTH_EXPANDED = 256
const SIDEBAR_WIDTH_CLOSED = 80
const BORDER_HEIGHT = 1
const WINDOWS_TITLEBAR_HEIGHT = 28
const NAVBAR_HEIGHT = 40
const DASHBOARD_CONTAINER_PADDING = 32

export default class TransakManager implements ITransakManager {
    private sidebarExpanded = false
    private htmlPath = app.isPackaged
        ? path.join(app.getAppPath(), '/public/transak.html')
        : path.join(__dirname, '../transak.html')
    private preloadPath = app.isPackaged
        ? path.join(app.getAppPath(), '/public/build/transak.preload.js')
        : path.join(__dirname, 'transak.preload.js')

    public setSidebarExpanded(isOpen: boolean): void {
        this.sidebarExpanded = isOpen
    }

    public closeWindow(): void {
        if (windows.transak) {
            windows.transak.close()
            windows.transak = null
        }
    }

    public openWindow(data: ITransakWindowData): BrowserWindow {
        if (windows.transak !== null) {
            return windows.transak
        }

        windows.transak = new BrowserWindow({
            parent: windows.main,
            width: 480,
            height: this.getWindowHeight(),
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

        this.positionWindow()
        this.sizeWindow()
        windows.main.on('move', () => this.positionWindow())
        windows.main.on('resize', () => {
            this.positionWindow()
            this.sizeWindow()
        })

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

    public positionWindow(): void {
        if (windows.transak && windows.transak) {
            const [mainWindowX, mainWindowY] = windows.main.getPosition()
            const [mainWindowWidth] = windows.main.getSize()
            const [transakWidth] = windows.transak.getSize()

            const sidebarWidth = this.sidebarExpanded ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_CLOSED
            const dashboardWidth = mainWindowWidth - sidebarWidth
            const transakX = Math.floor(mainWindowX + sidebarWidth + dashboardWidth / 2 - transakWidth / 2)
            const topBarHeight = this.getTopBarHeight()
            const transakY = mainWindowY + topBarHeight + DASHBOARD_CONTAINER_PADDING + BORDER_HEIGHT

            windows.transak.setPosition(transakX, transakY)
        }
    }

    private sizeWindow(): void {
        const [transakWidth] = windows.transak.getSize()
        const transakHeight = this.getWindowHeight()
        windows.transak.setSize(transakWidth, transakHeight)
    }

    private getTopBarHeight(): number {
        const titleBarHeight = process.platform === 'win32' ? WINDOWS_TITLEBAR_HEIGHT + BORDER_HEIGHT : 0
        const topBarHeight = NAVBAR_HEIGHT + BORDER_HEIGHT + titleBarHeight
        return topBarHeight
    }

    private getWindowHeight(): number {
        const [, mainWindowHeight] = windows.main.getSize()
        const topBarHeight = this.getTopBarHeight()
        return mainWindowHeight - topBarHeight - (DASHBOARD_CONTAINER_PADDING + BORDER_HEIGHT) * 2
    }
}
