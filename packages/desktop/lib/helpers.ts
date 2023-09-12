import { localize } from '@core/i18n'

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
    settings: localize('views.settings.settings'),
    security: localize('views.settings.security.title'),
    advanced: localize('views.settings.advanced.title'),
    errorLog: localize('views.settings.errorLog.title'),
    diagnostics: localize('views.settings.diagnostics.title'),
    logout: localize('views.dashboard.profileModal.logout'),
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
    version: localize('general.version'),
})
