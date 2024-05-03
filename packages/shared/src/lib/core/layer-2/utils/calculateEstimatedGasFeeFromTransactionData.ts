import { EvmTransactionData } from '../types'
import { calculateGasFeeInGlow } from '../helpers'
import { NetworkType } from '@core/network'

export function calculateEstimatedGasFeeFromTransactionData(
    transactionData: EvmTransactionData,
    networkType: NetworkType
): bigint | undefined {
    const { estimatedGas, gasPrice } = transactionData
    if (estimatedGas && gasPrice) {
        return calculateGasFeeInGlow(estimatedGas, gasPrice, networkType)
    } else {
        return undefined
    }
}
