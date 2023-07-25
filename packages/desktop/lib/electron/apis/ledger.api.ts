import { ipcRenderer } from 'electron'
import { LedgerMethod } from '../enums/ledger-method.enum'

export default {
    generateEvmAddress: (bip32Path: string, verify: boolean = false): void => {
        ipcRenderer.send(LedgerMethod.GenerateEvmAddress, bip32Path, verify)
    },
    signEvmTransaction: (transactionHex: string, bip32Path: string): void => {
        ipcRenderer.send(LedgerMethod.SignEvmTransaction, transactionHex, bip32Path)
    },
}
