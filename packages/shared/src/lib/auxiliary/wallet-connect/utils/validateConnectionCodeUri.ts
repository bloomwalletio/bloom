import { localize } from '@core/i18n'

export function validateConnectionCodeUri(uri: string): void {
    try {
        new URL(uri)
    } catch (_) {
        throw Error(localize('error.walletConnect.invalidUri'))
    }

    const url = new URL(uri)
    if (url.protocol !== 'wc:') {
        throw Error(localize('error.walletConnect.invalidProtocol'))
    }
}
