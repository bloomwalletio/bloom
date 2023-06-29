import { MENU_STATE } from './menu-state.constant'
import { shell } from 'electron'
import { DISCORD_URL, DOCUMENTATION_URL, FAQ_URL, ISSUE_REPORT_URL } from '@contexts/settings/constants'

const menuItem = (
    action: 'faq' | 'documentation' | 'discord' | 'reportAnIssue',
    url: string
): Electron.MenuItemConstructorOptions => ({
    label: MENU_STATE.strings[action],
    click: () => void shell.openExternal(url),
})

export const helpMenu: Electron.MenuItemConstructorOptions = {
    label: MENU_STATE.strings.help,
    submenu: [
        menuItem('faq', FAQ_URL),
        menuItem('documentation', DOCUMENTATION_URL),
        menuItem('discord', DISCORD_URL),
        menuItem('reportAnIssue', ISSUE_REPORT_URL),
    ],
}
