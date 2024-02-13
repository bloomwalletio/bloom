import { EvmTransactionData } from '../types'
import { calculateGasFeeInGlow } from '../helpers'
import { BigIntLike } from '@ethereumjs/util'

export function calculateMaxGasFeeFromTransactionData(transactionData: EvmTransactionData): bigint | undefined {
    const { gasLimit, gasPrice } = transactionData
    if (gasLimit && gasPrice) {
        return calculateGasFeeInGlow(gasLimit as BigIntLike, gasPrice as BigIntLike)
    } else {
        return undefined
    }
}
