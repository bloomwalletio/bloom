import { BigIntLike } from '@ethereumjs/util'
import { calculateGasFeeInGlow } from '../helpers'
import { EvmTransactionData } from '../types'

export function calculateMaxGasFeeFromTransactionData(transactionData: EvmTransactionData): BigIntLike | undefined {
    const { gasLimit, gasPrice } = transactionData
    if (gasLimit && gasPrice) {
        return calculateGasFeeInGlow(gasLimit, gasPrice)
    } else {
        return undefined
    }
}
