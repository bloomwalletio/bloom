import { EvmTransactionData } from '../types'
import { calculateGasFeeInGlow } from '../helpers'

export function calculateMaxGasFeeFromTransactionData(transactionData: EvmTransactionData): number | undefined {
    const { gasLimit, gasPrice } = transactionData
    if (gasLimit && gasPrice) {
        return Number(calculateGasFeeInGlow(gasLimit, gasPrice))
    } else {
        return undefined
    }
}
