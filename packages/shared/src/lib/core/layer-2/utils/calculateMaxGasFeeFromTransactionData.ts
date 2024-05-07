import { IEvmNetwork } from '@core/network'
import { EvmTransactionData } from '../types'

export function calculateMaxGasFeeFromTransactionData(
    transactionData: EvmTransactionData,
    network: IEvmNetwork
): bigint {
    const { gasLimit, gasPrice } = transactionData
    if (gasLimit && gasPrice) {
        return network.calculateGasFee(gasLimit, gasPrice)
    } else {
        return BigInt(0)
    }
}
