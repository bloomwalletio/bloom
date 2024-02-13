import { EvmTransactionData } from '../types'
import { calculateGasFeeInGlow } from '../helpers'
import { BigIntLike } from '@ethereumjs/util'

export function calculateEstimatedGasFeeFromTransactionData(transactionData: EvmTransactionData): bigint | undefined {
    const { estimatedGas, gasPrice } = transactionData
    if (estimatedGas && gasPrice) {
        return calculateGasFeeInGlow(estimatedGas, gasPrice as BigIntLike)
    } else {
        return undefined
    }
}
