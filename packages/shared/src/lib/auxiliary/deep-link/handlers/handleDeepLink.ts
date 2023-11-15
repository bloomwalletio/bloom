import { get } from 'svelte/store'

import { closePopup, openPopup, PopupId } from '../../../../../../desktop/lib/auxiliary/popup'
import { isLoggedIn, visibleActiveAccounts } from '@core/profile/stores'
import { dashboardRouter } from '@core/router/routers'
import { DashboardRoute } from '@core/router/enums'

import { resetDeepLink } from '../actions'
import { DeepLinkContext } from '../enums'
import { isDeepLinkRequestActive } from '../stores'

import { handleDeepLinkDappsContext } from './dapps/handleDeepLinkDappsContext'
import { handleDeepLinkGovernanceContext } from './governance/handleDeepLinkGovernanceContext'
import { handleDeepLinkWalletContext } from './wallet/handleDeepLinkWalletContext'
import { handleError } from '@core/error/handlers'
import { showNotification } from '@auxiliary/notification'
import { localize } from '@core/i18n'
import { addError } from '@core/error/stores'
import { URL_CLEANUP_REGEX } from '../constants'
import { closeDrawer } from '../../../../../../desktop/lib/auxiliary/drawer'

/**
 * Parses an Bloom deep link, i.e. a URL that begins with the app protocol i.e "bloom://".
 * @method parseDeepLinkRequest
 * @param {string} input The URL that was opened by the user.
 * @returns {void}
 */
export function handleDeepLink(input: string): void {
    if (!isLoggedIn()) {
        showNotification({
            variant: 'info',
            text: localize('notifications.deepLinkingRequest.receivedWhileLoggedOut'),
        })
        return
    }

    isDeepLinkRequestActive.set(true)
    if (!input || typeof input !== 'string') {
        resetDeepLink()
        return
    }

    try {
        const url = new URL(input)
        if (url.protocol !== `${process.env.APP_PROTOCOL}:`) {
            throw new Error(`Does not start with ${process.env.APP_PROTOCOL}://`)
        }

        closePopup()
        closeDrawer()

        handleDeepLinkForHostname(url)
    } catch (err) {
        handleError(err)
    } finally {
        resetDeepLink()
    }
}

function handleDeepLinkForHostname(url: URL): void {
    const pathnameParts = url.pathname.replace(URL_CLEANUP_REGEX, '').split('/')
    try {
        if (pathnameParts.length === 0 || !pathnameParts[0]) {
            throw new Error('No operation specified in the URL')
        }

        switch (url.hostname) {
            case DeepLinkContext.Wallet:
                get(dashboardRouter).goTo(DashboardRoute.Wallet)
                openAccountSwitcherFirst(() => handleDeepLinkWalletContext(pathnameParts, url.searchParams), url)
                break
            case DeepLinkContext.Governance:
                get(dashboardRouter).goTo(DashboardRoute.Governance)
                openAccountSwitcherFirst(() => handleDeepLinkGovernanceContext(pathnameParts, url.searchParams), url)
                break
            case DeepLinkContext.Dapps:
                handleDeepLinkDappsContext(pathnameParts, url.search)
                break
            default:
                throw new Error(`Unrecognized context '${url.hostname}'`)
        }
    } catch (err) {
        openPopup({
            id: PopupId.DeepLinkError,
            props: { error: err, url },
        })
        addError({ time: Date.now(), type: 'deepLink', message: `Error handling deep link. ${err.message}` })
    }
}

function openAccountSwitcherFirst(handler: () => void, url: URL): void {
    if (get(visibleActiveAccounts).length > 1) {
        openPopup({
            id: PopupId.AccountSwitcher,
            overflow: true,
            props: {
                onConfirm: () => {
                    try {
                        closePopup()
                        handler()
                    } catch (err) {
                        openPopup({
                            id: PopupId.DeepLinkError,
                            props: { error: err, url },
                        })
                        addError({
                            time: Date.now(),
                            type: 'deepLink',
                            message: `Error handling deep link. ${err.message}`,
                        })
                    }
                },
            },
        })
    } else {
        handler()
    }
}
