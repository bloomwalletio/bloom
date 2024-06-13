import { closePopup, openPopup, PopupId } from '../../../../../../desktop/lib/auxiliary/popup'
import { localize } from '@core/i18n'
import { Platform } from '../classes/platform.class'
import { externalAllowedLinks } from '../constants'
import { showNotification } from '@auxiliary/notification'

export function openUrlInBrowser(targetUrl: string | undefined): void {
    if (!targetUrl) {
        showNotification({
            variant: 'error',
            text: localize('error.global.invalidUrl'),
        })
        return
    }
    // If no protocol is specified, assume https
    if (!targetUrl.includes('://')) {
        targetUrl = 'https://' + targetUrl
    }
    // If the protocol is http, replace it with https
    targetUrl = targetUrl.replace(/^http:/, 'https:')

    const url = new URL(targetUrl)
    const domain = url.hostname.replace(/^www\./, '')
    const isAllowed = externalAllowedLinks.some((link) => {
        if (link.endsWith('*')) {
            const prefix = link.slice(0, -1)
            return domain.startsWith(prefix) || (domain + url.pathname).startsWith(prefix)
        } else {
            return link === domain || link === domain + url.pathname
        }
    })

    if (isAllowed) {
        openHttpsUrlsOnly(url.protocol, targetUrl)
    } else {
        openPopup({
            id: PopupId.Confirmation,
            props: {
                title: localize('popups.externalUrl.title'),
                text: localize('popups.externalUrl.body', { values: { url: targetUrl } }),
                confirmText: localize('popups.externalUrl.action'),
                onConfirm: () => {
                    openHttpsUrlsOnly(url.protocol, targetUrl)
                    closePopup()
                },
            },
        })
    }
}

function openHttpsUrlsOnly(protocol: string, targetUrl: string | undefined): void {
    if (targetUrl && protocol === 'https:') {
        void Platform.openUrl(targetUrl)
    } else {
        showNotification({
            variant: 'error',
            text: localize('popups.externalUrl.invalidProtocol'),
        })
    }
}
