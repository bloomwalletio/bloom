import { EvmTransactionData } from '@core/layer-2/types'

export interface ILedgerApi {
    generateEvmAddress(accountIndex: number, coinType: number, verify?: boolean): Promise<string>
    signEvmTransaction(transactionData: EvmTransactionData, bip32Path: string): Promise<string>
}
