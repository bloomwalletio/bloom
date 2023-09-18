import { BigIntLike } from '@ethereumjs/util'
import { SendFlowParameters } from '@core/wallet/types'
import { GAS_LIMIT_MULTIPLIER } from '../constants'
import { calculateGasFeeInGlow } from '../helpers'
import { getEvmChainGasPrice } from '../stores'
import { estimateGasForLayer1ToLayer2Transaction } from './estimateGasForLayer1ToLayer2Transaction'

export async function getGasFeesForLayer1ToLayer2Transaction(
    sendFlowParameters: SendFlowParameters
): Promise<{ estimatedGasFee: BigIntLike; maxGasFee: BigIntLike }> {
    try {
        if (sendFlowParameters.destinationNetworkId) {
            const estimatedGas = await estimateGasForLayer1ToLayer2Transaction(sendFlowParameters)
            const gasLimit = Math.floor(estimatedGas * GAS_LIMIT_MULTIPLIER)
            const gasPrice = getEvmChainGasPrice(sendFlowParameters.destinationNetworkId)
            const estimatedGasFee = calculateGasFeeInGlow(estimatedGas, gasPrice)
            const maxGasFee = calculateGasFeeInGlow(gasLimit, gasPrice)
            return { estimatedGasFee, maxGasFee }
        } else {
            return { estimatedGasFee: BigInt(0), maxGasFee: BigInt(0) }
        }
    } catch (error) {
        return { estimatedGasFee: BigInt(0), maxGasFee: BigInt(0) }
    }
}
