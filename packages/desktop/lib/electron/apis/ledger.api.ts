import { ipcRenderer } from 'electron'
import { LedgerMethod } from '../enums/ledger-method.enum'

export default {
    generateEvmAddress: (bip32Path: string, verify: boolean = false): void => {
        console.log('(ledger.api) generate evm address: ', bip32Path)
        ipcRenderer.send(LedgerMethod.GenerateEvmAddress, bip32Path, verify)
    },
    signEvmTransaction: (data: unknown, bip32Path: string): void => {
        ipcRenderer.send(LedgerMethod.SignEvmTransaction, data, bip32Path)
    },
}
