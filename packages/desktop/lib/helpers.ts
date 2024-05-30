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
    addAccount: localize('actions.addAccount'),
    advanced: localize('views.settings.advanced.title'),
    checkForUpdates: localize('actions.checkForUpdates'),
    copy: localize('actions.copy'),
    cut: localize('actions.cut'),
    developerTools: localize('general.developerTools'),
    diagnostics: localize('views.settings.diagnostics.title'),
    discord: localize('views.settings.discord.title'),
    documentation: localize('views.settings.documentation.title'),
    edit: localize('actions.edit'),
    errorLog: localize('views.settings.errorLog.title'),
    faq: localize('views.settings.faq.title'),
    help: localize('general.help'),
    hide: localize('actions.hide'),
    hideOthers: localize('actions.hideOthers'),
    importThirdPartyProfiles: localize('actions.importThirdPartyProfiles'),
    logout: localize('views.dashboard.profileMenu.logout'),
    paste: localize('actions.paste'),
    quit: localize('actions.quit'),
    redo: localize('actions.redo'),
    reportAnIssue: localize('actions.reportAnIssue'),
    security: localize('views.settings.security.title'),
    selectAll: localize('actions.selectAll'),
    settings: localize('views.settings.settings'),
    showAll: localize('actions.showAll'),
    undo: localize('actions.undo'),
    version: localize('general.versionFull'),
    wallet: localize('general.wallet'),
})

export function registerMenuButtons(): void {
    Platform.onEvent('menu-navigate-wallet', () => {
        get(dashboardRouter)?.goTo(DashboardRoute.Wallet)
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
