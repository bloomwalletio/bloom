import { ipcRenderer } from 'electron'
import { LedgerMethod } from '../enums/ledger-method.enum'

export default {
    makeRequest: (method: LedgerMethod, ...parameters: unknown[]) => {
        ipcRenderer.send(method, ...parameters)
    }
}

export interface ILedgerApiBridge {
    makeRequest(method: LedgerMethod.GenerateEvmAddress, bip32Path: string, verify: boolean): void
    makeRequest(method: LedgerMethod.SignEvmTransaction, transactionHex: string, bip32Path: string): void
}
