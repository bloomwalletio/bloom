import { Platform } from '@core/app/classes'
import { localize } from '@core/i18n'
import { DashboardRoute } from '@core/router/enums'
import { dashboardRouter } from '@core/router/routers'
import { get } from 'svelte/store'
import { PopupId, closePopup, openPopup } from './auxiliary/popup'
import { closeDrawer } from './auxiliary/drawer'
import { closeSettings, openSettings } from '@contexts/settings/stores'
import { appVersionDetails } from '@core/app/stores'

/**
 * Returns localised Electron menu items
 *
 * @method getLocalisedMenuItems
 *
 * @returns {object}
 */
export const getLocalisedMenuItems = (): unknown => ({
    about: localize('views.settings.about.title'),
    checkForUpdates: localize('actions.checkForUpdates'),
    importThirdPartyProfiles: localize('actions.importThirdPartyProfiles'),
    settings: localize('views.settings.settings'),
    security: localize('views.settings.security.title'),
    advanced: localize('views.settings.advanced.title'),
    errorLog: localize('views.settings.errorLog.title'),
    diagnostics: localize('views.settings.diagnostics.title'),
    logout: localize('views.dashboard.profileMenu.logout'),
    hide: localize('actions.hide'),
    hideOthers: localize('actions.hideOthers'),
    showAll: localize('actions.showAll'),
    quit: localize('actions.quit'),
    edit: localize('actions.edit'),
    undo: localize('actions.undo'),
    redo: localize('actions.redo'),
    cut: localize('actions.cut'),
    copy: localize('actions.copy'),
    paste: localize('actions.paste'),
    selectAll: localize('actions.selectAll'),
    wallet: localize('general.wallet'),
    addAccount: localize('actions.addAccount'),
    help: localize('general.help'),
    faq: localize('views.settings.faq.title'),
    documentation: localize('views.settings.documentation.title'),
    discord: localize('views.settings.discord.title'),
    reportAnIssue: localize('actions.reportAnIssue'),
    version: localize('general.versionFull'),
})

export function registerMenuButtons(): void {
    Platform.onEvent('menu-navigate-wallet', () => {
        get(dashboardRouter).goTo(DashboardRoute.Wallet)
    })
    Platform.onEvent('menu-navigate-settings', () => {
        closePopup({ callOnCancel: true })
        closeOverlays()
        openSettings()
    })
    Platform.onEvent('menu-check-for-update', () => {
        closeOverlays()
        openPopup(
            {
                id: PopupId.CheckForUpdates,
                props: {
                    currentVersion: get(appVersionDetails).currentVersion,
                },
            },
            false,
            false
        )
    })
    Platform.onEvent('import-third-party-profile', () => {
        closeOverlays()
        openPopup({ id: PopupId.ImportProfilesFromThirdParty }, false, false)
    })
    Platform.onEvent('menu-error-log', () => {
        closeOverlays()
        openPopup({ id: PopupId.ErrorLog }, false, false)
    })
    Platform.onEvent('menu-diagnostics', () => {
        closeOverlays()
        openPopup({ id: PopupId.Diagnostics }, false, false)
    })
}

function closeOverlays(): void {
    closeDrawer()
    closePopup()
    closeSettings()
}
