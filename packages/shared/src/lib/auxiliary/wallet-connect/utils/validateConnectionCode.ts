import { localize } from '@core/i18n'

export function validateConnectionCode(uri: string): void {
    try {
        new URL(uri)
    } catch (_) {
        throw Error(localize('error.walletConnect.invalidUri'))
    }

    const url = new URL(uri)
    if (url.protocol !== 'wc:') {
        throw Error(localize('error.walletConnect.invalidProtocol'))
    }

    if (url.pathname.split('@')?.[1] !== '2') {
        throw Error(localize('error.walletConnect.deprecatedVersion'))
    }
}
