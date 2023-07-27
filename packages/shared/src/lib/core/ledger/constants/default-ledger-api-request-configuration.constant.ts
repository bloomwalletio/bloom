import { ILedgerApiRequestOptions } from '../interfaces'

export const DEFAULT_LEDGER_API_REQUEST_CONFIGURATION: ILedgerApiRequestOptions = {
    timeout: 60,
    pollingInterval: 100,
}
