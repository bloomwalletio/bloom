import { menuState } from './menu'
import { shell } from 'electron'
import { DISCORD_URL, DOCUMENTATION_URL, ISSUE_REPORT_URL } from '@contexts/settings/constants'

const menuItem = (
    action: 'faq' | 'documentation' | 'discord' | 'reportAnIssue',
    url: string
): Electron.MenuItemConstructorOptions => ({
    label: menuState.strings[action],
    click: () => void shell.openExternal(url),
})

export function buildHelpMenu(): Electron.MenuItemConstructorOptions {
    return {
        label: menuState.strings.help,
        submenu: [
            // menuItem('faq', FAQ_URL),
            menuItem('documentation', DOCUMENTATION_URL),
            menuItem('discord', DISCORD_URL),
            menuItem('reportAnIssue', ISSUE_REPORT_URL),
        ],
    }
}
