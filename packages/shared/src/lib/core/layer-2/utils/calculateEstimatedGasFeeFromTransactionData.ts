import { BigIntLike } from '@ethereumjs/util'
import { EvmTransactionData } from '../types'
import { calculateGasFeeInGlow } from '../helpers'

export function calculateEstimatedGasFeeFromTransactionData(
    transactionData: EvmTransactionData
): BigIntLike | undefined {
    const { estimatedGas, gasPrice } = transactionData
    if (estimatedGas && gasPrice) {
        return calculateGasFeeInGlow(estimatedGas, gasPrice)
    } else {
        return undefined
    }
}
