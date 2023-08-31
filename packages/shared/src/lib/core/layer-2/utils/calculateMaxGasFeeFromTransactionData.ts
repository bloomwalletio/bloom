import { BigIntLike } from '@ethereumjs/util'
import { EvmTransactionData } from '../types'
import { calculateGasFeeInGlow } from '../helpers'

export function calculateMaxGasFeeFromTransactionData(transactionData: EvmTransactionData): BigIntLike | undefined {
    const { gasLimit, gasPrice } = transactionData
    if (gasLimit && gasPrice) {
        return calculateGasFeeInGlow(gasLimit, gasPrice)
    } else {
        return undefined
    }
}
