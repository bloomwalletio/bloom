import semver from 'semver'
import { get } from 'svelte/store'
import { MINIMUM_SUPPORTED_LEDGER_APP_VERSION } from '../constants'
import { LedgerAppName } from '../enums'
import { ledgerDeviceState } from '../stores'

export function isLedgerAppVersionSupported(appName: LedgerAppName): boolean {
    const currentVersion = get(ledgerDeviceState)?.settings?.[appName]?.version
    const minimumSupportedVersion = MINIMUM_SUPPORTED_LEDGER_APP_VERSION[appName]
    return semver.gte(currentVersion, minimumSupportedVersion)
}
