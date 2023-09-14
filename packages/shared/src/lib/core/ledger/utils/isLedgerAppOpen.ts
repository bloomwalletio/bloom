import { get } from 'svelte/store'

import { LedgerAppName } from '../enums'
import { ledgerDeviceState } from '../stores'

export function isLedgerAppOpen(appName: LedgerAppName): boolean {
    return get(ledgerDeviceState)?.app === appName
}
