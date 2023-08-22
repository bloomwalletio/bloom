import { EvmTransactionData } from '../types'
import { calculateGasFeeInGlow } from './calculateGasFeeInGlow'

export function calculateMaxGasFeeFromTransactionData(transactionData: EvmTransactionData): string | undefined {
    const { gasLimit, gasPrice } = transactionData
    if (gasLimit && gasPrice) {
        return calculateGasFeeInGlow(gasLimit, gasPrice)
    } else {
        return undefined
    }
}
