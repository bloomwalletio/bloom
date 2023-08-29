import { get } from 'svelte/store'

import { LedgerAppName } from '../enums'
import { ledgerNanoState } from '../stores'

export function isLedgerAppOpen(appName: LedgerAppName): boolean {
    return get(ledgerNanoState)?.app === appName
}
