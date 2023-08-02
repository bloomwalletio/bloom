import { LedgerApiMethod } from '../enums'

export interface ILedgerApiBridge {
    makeRequest(method: LedgerApiMethod.GenerateEvmAddress, bip32Path: string, verify: boolean): void
    makeRequest(method: LedgerApiMethod.SignEvmTransaction, transactionHex: string, bip32Path: string): void
}
