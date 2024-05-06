import { EvmTransactionData } from '../types'
import { calculateGasFeeInGlow } from '../helpers'

export function calculateEstimatedGasFeeFromTransactionData(transactionData: EvmTransactionData): bigint {
    const { estimatedGas, gasPrice } = transactionData
    if (estimatedGas && gasPrice) {
        return calculateGasFeeInGlow(estimatedGas, gasPrice)
    } else {
        return BigInt(0)
    }
}
