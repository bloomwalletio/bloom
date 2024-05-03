import { EvmTransactionData } from '../types'
import { calculateGasFee } from '../helpers'
import { NetworkType } from '@core/network'

export function calculateMaxGasFeeFromTransactionData(
    transactionData: EvmTransactionData,
    networkType: NetworkType
): bigint {
    const { gasLimit, gasPrice } = transactionData
    if (gasLimit && gasPrice) {
        return calculateGasFee(gasLimit, gasPrice, networkType)
    } else {
        return BigInt(0)
    }
}
