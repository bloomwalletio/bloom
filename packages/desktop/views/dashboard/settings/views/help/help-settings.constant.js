import { HelpRoute } from '@core/router'
import { Diagnostics, ErrorLog, HelpSection } from '.'
import { DISCORD_URL, DOCUMENTATION_URL, FAQ_URL, ISSUE_REPORT_URL } from '@contexts/settings'

export const HELP_SETTINGS = [
    { component: Diagnostics, childRoute: HelpRoute.Diagnostics },
    { component: ErrorLog, childRoute: HelpRoute.ErrorLog },
    {
        component: HelpSection,
        childRoute: HelpRoute.Documentation,
        props: {
            url: DOCUMENTATION_URL,
            actionLocale: 'readDocumentation',
        },
    },
    {
        component: HelpSection,
        childRoute: HelpRoute.Faq,
        props: {
            url: FAQ_URL,
            actionLocale: 'visitFaq',
        },
    },
    {
        component: HelpSection,
        childRoute: HelpRoute.Discord,
        props: {
            url: DISCORD_URL,
            actionLocale: 'visitDiscord',
        },
    },
    {
        component: HelpSection,
        childRoute: HelpRoute.ReportAnIssue,
        props: {
            url: ISSUE_REPORT_URL,
            actionLocale: 'reportAnIssue',
        },
    },
]
