import { MILLISECONDS_PER_SECOND } from '@core/utils'
import { ILedgerApiRequestOptions } from '../interfaces'

export const DEFAULT_LEDGER_API_REQUEST_OPTIONS: ILedgerApiRequestOptions = {
    shouldClosePopup: true,
    timeout: 60 * MILLISECONDS_PER_SECOND,
}
