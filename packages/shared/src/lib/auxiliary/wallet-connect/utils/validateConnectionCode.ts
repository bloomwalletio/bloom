import { localize } from '@core/i18n'

export function validateConnectionCode(uri: string): void {
    const url = new URL(uri)
    try {
        new URL(uri)
    } catch (_) {
        throw Error(localize('error.notValidUri'))
    }

    if (url.protocol !== 'wc:') {
        throw Error(localize('error.invalidProtocol'))
    }

    if (url.pathname.split('@')?.[1] !== '2') {
        throw Error(localize('error.deprecatedVersion'))
    }
}
