import { MILLISECONDS_PER_SECOND } from '@core/utils'
import { ILedgerApiRequestOptions } from '../interfaces'

export const DEFAULT_LEDGER_API_REQUEST_OPTIONS: ILedgerApiRequestOptions = {
    timeout: 60 * MILLISECONDS_PER_SECOND, // In milliseconds
    pollingInterval: 100, // In milliseconds
}
