import { calculateGasFee } from '@core/network/utils'
import { EvmTransactionData } from '../types'

export function calculateMaxGasFeeFromTransactionData(transactionData: EvmTransactionData): bigint {
    const { gasLimit, gasPrice } = transactionData
    return calculateGasFee(gasLimit, gasPrice)
}
