import type { SyncOptions } from '@iota/sdk'

export interface RecoverAccountsPayload {
    accountStartIndex: number
    accountGapLimit: number
    addressGapLimit: number
    syncOptions?: SyncOptions
}
