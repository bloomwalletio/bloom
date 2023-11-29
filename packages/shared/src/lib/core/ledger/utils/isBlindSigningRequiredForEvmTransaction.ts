import type { EvmTransactionData } from '@core/layer-2/types'

export function isBlindSigningRequiredForEvmTransaction(transactionData: EvmTransactionData): boolean {
    return Boolean(transactionData?.data)
}
