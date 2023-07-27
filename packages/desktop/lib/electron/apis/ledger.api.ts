import { ipcRenderer } from 'electron'
import { LedgerApiMethod } from '@core/ledger/enums'

export default {
    makeRequest: (method: LedgerApiMethod, ...parameters: unknown[]) => {
        ipcRenderer.send(method, ...parameters)
    }
}
