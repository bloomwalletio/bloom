import { EvmTransactionData } from '../types'
import { calculateGasFeeInGlow } from './calculateGasFeeInGlow'

export function calculateEstimatedGasFeeFromTransactionData(transactionData: EvmTransactionData): string | undefined {
    const { estimatedGas, gasPrice } = transactionData
    if (estimatedGas && gasPrice) {
        return calculateGasFeeInGlow(estimatedGas, gasPrice)
    } else {
        return undefined
    }
}
