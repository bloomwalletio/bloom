import { EvmTransactionData } from '../types'
import { calculateGasFee } from '@core/network'

export function calculateEstimatedGasFeeFromTransactionData(transactionData: EvmTransactionData): bigint {
    const { estimatedGas, gasPrice } = transactionData
    return calculateGasFee(estimatedGas, gasPrice)
}
