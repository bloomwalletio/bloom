import { EvmTransactionData } from '../types'
import { calculateGasFeeInGlow } from '../helpers'

export function calculateMaxGasFeeFromTransactionData(transactionData: EvmTransactionData): bigint | undefined {
    const { gasLimit, gasPrice } = transactionData
    if (gasLimit && gasPrice) {
        return calculateGasFeeInGlow(gasLimit, gasPrice)
    } else {
        return undefined
    }
}
