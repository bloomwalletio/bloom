import { get } from 'svelte/store'

import { showNotification } from '@auxiliary/notification'
import { pairWithNewDapp } from '@auxiliary/wallet-connect/actions'
import { handleError } from '@core/error/handlers'
import { localize } from '@core/i18n'
import { getActiveProfile, visibleActiveAccounts } from '@core/profile/stores'
import { DashboardRoute } from '@core/router/enums'
import { dashboardRouter } from '@core/router/routers'
import { closePopup, openPopup, PopupId } from '../../../../../../desktop/lib/auxiliary/popup'

import { resetDeepLink } from '../actions'
import { DeepLinkContext } from '../enums'
import { isDeepLinkRequestActive } from '../stores'

import { handleDeepLinkGovernanceContext } from './governance/handleDeepLinkGovernanceContext'
import { handleDeepLinkWalletContext } from './wallet/handleDeepLinkWalletContext'

/**
 * Parses an IOTA deep link, i.e. a URL that begins with the app protocol i.e "firefly://".
 * @method parseDeepLinkRequest
 * @param {string} input The URL that was opened by the user.
 * @returns {void}
 */
export function handleDeepLink(input: string): void {
    const { loggedIn } = getActiveProfile()

    if (!get(loggedIn)) {
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

        if (get(visibleActiveAccounts).length > 1) {
            openPopup({
                id: PopupId.AccountSwitcher,
                overflow: true,
                props: {
                    onConfirm: () => {
                        closePopup()
                        handleDeepLinkForHostname(url)
                    },
                },
            })
        } else {
            handleDeepLinkForHostname(url)
        }
    } catch (err) {
        handleError(err)
    } finally {
        resetDeepLink()
    }
}

function handleDeepLinkForHostname(url: URL): void {
    switch (url.hostname) {
        case DeepLinkContext.Wallet:
            get(dashboardRouter).goTo(DashboardRoute.Wallet)
            handleDeepLinkWalletContext(url)
            break
        case DeepLinkContext.Governance:
            get(dashboardRouter).goTo(DashboardRoute.Governance)
            handleDeepLinkGovernanceContext(url)
            break
        case DeepLinkContext.Connect:
            handleConnect(url)
            break
        default:
            throw new Error(`Unrecognized context '${url.hostname}'`)
    }
}

function handleConnect(url: URL): void {
    const walletConnectUri = url.pathname.split('/')[1] + url.search
    if (walletConnectUri) {
        openPopup({
            id: PopupId.Confirmation,
            props: {
                title: walletConnectUri,
                onConfirm: () => {
                    pairWithNewDapp(walletConnectUri)
                    closePopup()
                },
            },
        })
    }
}
