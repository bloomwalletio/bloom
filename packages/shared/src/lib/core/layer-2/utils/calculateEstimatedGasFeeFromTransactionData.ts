import { EvmTransactionData } from '../types'
import { calculateGasFee } from '../helpers'
import { NetworkType } from '@core/network'

export function calculateEstimatedGasFeeFromTransactionData(
    transactionData: EvmTransactionData,
    networkType: NetworkType
): bigint {
    const { estimatedGas, gasPrice } = transactionData
    if (estimatedGas && gasPrice) {
        return calculateGasFee(estimatedGas, gasPrice, networkType)
    } else {
        return BigInt(0)
    }
}
