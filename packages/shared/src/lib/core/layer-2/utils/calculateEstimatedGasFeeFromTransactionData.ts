import { EvmTransactionData } from '../types'
import { IEvmNetwork } from '@core/network'

export function calculateEstimatedGasFeeFromTransactionData(
    transactionData: EvmTransactionData,
    network: IEvmNetwork
): bigint {
    const { estimatedGas, gasPrice } = transactionData
    if (estimatedGas && gasPrice) {
        return network.calculateGasFee(estimatedGas, gasPrice)
    } else {
        return BigInt(0)
    }
}
