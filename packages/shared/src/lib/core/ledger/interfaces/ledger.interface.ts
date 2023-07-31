export interface ILedger {
    generateEvmAddress(bip32Path: string, verify?: boolean): void
    signEvmTransaction(transactionHex: string, bip32Path: string): void
}
