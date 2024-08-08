import { LedgerAppName } from '../enums'

export const MINIMUM_SUPPORTED_LEDGER_APP_VERSION: Record<LedgerAppName, string> = {
    [LedgerAppName.Iota]: '0.8.6',
    [LedgerAppName.Shimmer]: '0.8.6',
    [LedgerAppName.Ethereum]: '1.10.3',
    [LedgerAppName.Bolos]: '0.0.0',
}
