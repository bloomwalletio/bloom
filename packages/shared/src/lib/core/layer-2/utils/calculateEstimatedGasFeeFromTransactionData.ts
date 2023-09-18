import { BigIntLike } from '@ethereumjs/util'
import { calculateGasFeeInGlow } from '../helpers'
import { EvmTransactionData } from '../types'

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
