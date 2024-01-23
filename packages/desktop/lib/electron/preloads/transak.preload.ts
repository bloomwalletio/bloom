import { IpcRendererEvent, ipcRenderer } from 'electron'

interface TransakData {
    apiKey: string
    currency: string
    address: string
    stage: 'production' | 'staging'
    service: 'BUY' | 'SELL'
}

window.addEventListener('DOMContentLoaded', () => {
    ipcRenderer.on('transak-data', (_: IpcRendererEvent, data: TransakData) => {
        window.document.documentElement.style.height = '100%'
        window.document.body.style.margin = '0'
        window.document.body.style.padding = '0'
        window.document.body.style.width = '100dvw'
        window.document.body.style.height = '100dvh'
        window.document.body.style.borderRadius = '16px'
        window.document.body.style.display = 'flex'
        window.document.body.style.alignItems = 'center'
        window.document.body.style.justifyContent = 'center'

        if (window.document.getElementById('transakIframe')) {
            return
        }

        const { apiKey, currency, address, stage, service } = data
        const transakUrl = stage === 'production' ? 'https://global.transak.com' : 'https://global-stg.transak.com'

        const iframe = window.document.createElement('iframe')
        iframe.id = 'transakIframe'
        iframe.src = `${transakUrl}/?apiKey=${apiKey}&defaultFiatCurrency=${currency}&walletAddress=${address}&productsAvailed=${service}&cryptoCurrencyCode=IOTA&network=miota&themeColor=7C41C9&hideMenu=true`
        iframe.style.width = '100%'
        iframe.style.height = '100%'
        iframe.style.border = 'none'
        iframe.style.borderRadius = '16px'
        iframe.allow = 'camera;microphone;payment'
        iframe.sandbox.add(
            'allow-scripts',
            'allow-forms',
            'allow-top-navigation-by-user-activation',
            'allow-same-origin',
            'allow-popups'
        )

        window.document.body.appendChild(iframe)

        window.addEventListener('message', (message) => {
            if (message.source !== iframe.contentWindow) return

            if (message?.data?.event_id === 'TRANSAK_ORDER_SUCCESSFUL') {
                void ipcRenderer.invoke('close-transak')
            }
        })
    })
})
