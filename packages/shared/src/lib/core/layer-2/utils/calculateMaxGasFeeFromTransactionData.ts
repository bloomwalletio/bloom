import { EvmTransactionData } from '../types'
import { calculateGasFeeInGlow } from '../helpers'
import { NetworkType } from '@core/network'

export function calculateMaxGasFeeFromTransactionData(
    transactionData: EvmTransactionData,
    networkType: NetworkType
): bigint | undefined {
    const { gasLimit, gasPrice } = transactionData
    if (gasLimit && gasPrice) {
        return calculateGasFeeInGlow(gasLimit, gasPrice, networkType)
    } else {
        return undefined
    }
}
