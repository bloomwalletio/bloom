import { BrowserWindow, app, shell, screen } from 'electron'
import { windows } from '../constants/windows.constant'
import features from '@features/features'
import { ITransakManager, ITransakWindowData } from '@core/app'
import path from 'path'
import { TRANSAK_WIDGET_URL } from '@auxiliary/transak'
import { validateUrlDomain } from '@core/utils/url'

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

    public hideWindow(): void {
        windows.transak?.hide()
    }

    public showWindow(): void {
        windows.transak?.show()
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
            hiddenInMissionControl: true,
            acceptFirstMouse: true,
            hasShadow: false,
            thickFrame: false,
            roundedCorners: true,
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

        // const currentUserAgent = windows.transak.webContents.getUserAgent()
        // const newUserAgent = currentUserAgent.replace(/Electron\/[^\s]+\s*/, '') // Necessary for Google Pay to work
        // windows.transak.webContents.setUserAgent(newUserAgent)

        const url = this.getUrl(data)
        void windows.transak.loadURL(url)

        windows.transak.webContents.setWindowOpenHandler(({ url }) => {
            console.log('setWindowOpenHandler', url)
            // console.log(url)
            // if (!url.includes(TRANSAK_WIDGET_URL)) {
            // }

            if (validateUrlDomain(url, 'google.com')) {
               return { action: 'deny' }
            }

            void shell.openExternal(url)
            return { action: 'deny' }
        })

        windows.transak.setMenu(null)

        windows.transak.webContents.addListener('did-navigate', (_, url) => {
            const _url = new URL(url)
            windows.main.webContents.send('transak-url', _url.origin)
        })

        windows.transak.webContents.addListener('will-navigate', (event) => {
            if (validateUrlDomain(event.url, 'google.com')) {
                return
            }

            event.preventDefault()
            void shell.openExternal(event.url)
        })

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

                const newX = Math.floor(mainWindowX + this.rect.x)
                const newY = Math.floor(mainWindowY + menuHeight + this.rect.y)

                windows.transak.setBounds({
                    x: newX,
                    y: newY,
                    height: this.rect.height,
                    width: this.rect.width,
                })

                if (process.platform === 'linux') {
                    const windowBounds = windows.transak.getBounds()
                    const nearestDisplay = screen.getDisplayNearestPoint({ x: windowBounds.x, y: windowBounds.y })
                    const displayBounds = nearestDisplay.bounds

                    const isOutOfBounds =
                        windowBounds.x < displayBounds.x ||
                        windowBounds.y < displayBounds.y ||
                        windowBounds.x + windowBounds.width > displayBounds.x + displayBounds.width ||
                        windowBounds.y + windowBounds.height > displayBounds.y + displayBounds.height

                    if (isOutOfBounds) {
                        windows.transak.hide()
                    } else if (!windows.transak.isVisible()) {
                        windows.transak.show()
                    }
                }
            }
        } catch (error) {
            console.error('positionWindow error', error)
        }
    }

    private getUrl(data: ITransakWindowData): string {
        const { address, currency, service } = data
        const apiKey = process.env.TRANSAK_API_KEY

        return `${TRANSAK_WIDGET_URL}/?apiKey=${apiKey}&defaultFiatCurrency=${currency}&walletAddress=${address}&productsAvailed=${service}&cryptoCurrencyCode=IOTA&network=miota&themeColor=7C41C9&hideMenu=true`
    }
}
