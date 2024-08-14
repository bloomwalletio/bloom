import { BrowserWindow, app, shell, screen, nativeTheme, ipcMain, systemPreferences } from 'electron'
import { windows } from '../constants/windows.constant'
import features from '@features/features'
import { ITransakManager, ITransakWindowData } from '@core/app'
import path from 'path'
import { TRANSAK_PRODUCTION_WIDGET_URL, TRANSAK_STAGING_WIDGET_URL } from '@auxiliary/transak/constants'
import { buildUrl } from '@core/utils/url'
import { FiatCurrency } from '@core/market/enums/fiat-currency.enum'
import fs from 'fs'
import { IError } from '@core/error'
import { QueryParameters } from '@core/utils'

export default class TransakManager implements ITransakManager {
    private rect: Electron.Rectangle | undefined

    private getPreloadPath(): string {
        const preloadPath = app.isPackaged
            ? path.join(app.getAppPath(), 'public', 'build', 'transak.preload.js')
            : path.join(__dirname, 'transak.preload.js')

        if (!this.validatePreloadPath(preloadPath)) {
            throw new Error(`Could not load ${preloadPath}`)
        }

        return preloadPath
    }

    private validatePreloadPath(preloadPath: string): boolean {
        if (!preloadPath) {
            return false
        }

        if (!fs.existsSync(preloadPath)) {
            return false
        }

        if (path.extname(preloadPath) !== '.js') {
            return false
        }

        return true
    }

    public closeWindow(): void {
        if (windows.transak) {
            ipcMain.removeHandler('transak-loaded')
            windows.transak.destroy()
            windows.transak = null
        }
    }

    public hideWindow(): void {
        windows.transak?.hide()
    }

    public showWindow(): void {
        windows.transak?.show()
    }

    public openWindow(data: ITransakWindowData): BrowserWindow | undefined {
        let preloadPath: string
        try {
            preloadPath = this.getPreloadPath()
        } catch (err) {
            windows.main?.webContents?.send?.('transak-not-loaded')
            console.error((err as IError).message)
            return
        }

        if (windows.transak !== null) {
            return windows.transak
        }

        this.rect = { x: 0, y: 0, width: 480, height: 613 }

        windows.transak = new BrowserWindow({
            ...(windows.main && { parent: windows.main }),
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
            roundedCorners: false,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                disableBlinkFeatures: 'Auxclick',
                webviewTag: false,
                enableWebSQL: false,
                devTools: !app.isPackaged || features?.electron?.developerTools?.enabled,
                preload: preloadPath,
            },
        })

        if (process.platform === 'darwin') {
            windows.transak.setWindowButtonVisibility(false)
        }

        windows.main?.on?.('move', () => this.positionWindow())

        windows.transak.once('closed', () => {
            windows.transak = null
        })

        windows.transak.once('ready-to-show', () => this.hideWindow())

        windows.transak.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
            if (permission === 'media') {
                callback(true)
            } else {
                callback(false)
            }
        })

        let initialUrl: string
        try {
            initialUrl = this.getUrl(data)
            void windows.transak.loadURL(initialUrl)
        } catch (err) {
            console.error(err)
        }

        windows.transak.webContents.setWindowOpenHandler(({ url }) => {
            void shell.openExternal(url)
            return { action: 'deny' }
        })

        windows.transak.setMenu(null)

        windows.transak.webContents.addListener('did-navigate', (_, url) => {
            const _url = new URL(url)
            windows.main?.webContents?.send?.('transak-url', _url.origin)
        })

        windows.transak.webContents.addListener('did-navigate-in-page', (_, url) => {
            const widgetUrl =
                data.environment === 'PRODUCTION' ? TRANSAK_PRODUCTION_WIDGET_URL : TRANSAK_STAGING_WIDGET_URL

            const googlePayUrl = widgetUrl + '/googlepay'
            if (url.startsWith(googlePayUrl)) {
                windows.main?.webContents?.send?.('try-open-url-in-browser', url)
                void windows.transak?.loadURL?.(initialUrl)
            }

            const kycUrl = widgetUrl + '/user/kyc-forms/idProof'
            if (process.platform === 'darwin' && url.startsWith(kycUrl)) {
                void systemPreferences.askForMediaAccess('camera')
            }
        })

        windows.transak.webContents.addListener('will-navigate', (event) => {
            event.preventDefault()
            windows.main?.webContents.send('try-open-url-in-browser', event.url)
        })

        ipcMain.handle('transak-loaded', () => {
            setTimeout(() => {
                windows.main?.webContents.send('transak-loaded')
                this.showWindow()
            }, 300)
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
                const [mainWindowX, mainWindowY] = windows.main?.getPosition() ?? [0, 0]
                const [, mainWindowHeight] = windows.main?.getSize() ?? [1280, 720]
                const [, bodyHeight] = windows.main?.getContentSize() ?? [1280, 720]

                const menuHeight = mainWindowHeight - bodyHeight

                const newX = Math.floor(mainWindowX + (this.rect?.x ?? 0))
                const newY = Math.floor(mainWindowY + menuHeight + (this.rect?.y ?? 0))

                windows.transak.setBounds({
                    x: newX,
                    y: newY,
                    height: this.rect?.height,
                    width: this.rect?.width,
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
        const { address, currency, service, amount, paymentMethod, networkName, cryptoCurrencySymbol, environment } =
            data
        const apiKey = process.env.TRANSAK_API_KEY

        if (typeof apiKey !== 'string') {
            throw new Error('Undefined Transak API key')
        }

        if (!Object.keys(FiatCurrency).includes(currency)) {
            throw new Error('Invalid Transak currency')
        }

        if (service !== 'BUY' && service !== 'SELL') {
            throw new Error('Invalid Transak service')
        }

        const colorMode =
            nativeTheme.themeSource === 'system'
                ? nativeTheme.shouldUseDarkColors
                    ? 'DARK'
                    : 'LIGHT'
                : nativeTheme.themeSource.toUpperCase()

        const queryParams: QueryParameters = {
            apiKey,

            // Styling
            colorMode,
            themeColor: '7C41C9',

            // Service Feature Flags
            productsAvailed: service,
            hideMenu: false,
            isFeeCalculationHidden: true,
            disablePaymentMethods: ['apple_pay', 'google_pay'],
            excludeFiatCurrencies: 'USD',

            // Quotations Fields
            fiatCurrency: currency,
            fiatAmount: amount,
            network: networkName,
            cryptoCurrencyCode: cryptoCurrencySymbol,
            walletAddress: address,
            paymentMethod: paymentMethod,

            // Flags for skippable forms
            hideExchangeScreen: true,
            disableWalletAddressForm: true,
        }

        const widgetUrl = environment === 'PRODUCTION' ? TRANSAK_PRODUCTION_WIDGET_URL : TRANSAK_STAGING_WIDGET_URL

        const urlObject = buildUrl({ base: widgetUrl, query: queryParams })

        return urlObject?.href ?? ''
    }
}
