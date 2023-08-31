import { Converter } from '@core/utils'
import Web3 from 'web3'
import { getEvmTransactionValueFromAmount } from '../helpers/getEvmTransactionValueFromAmount'
import { GAS_LIMIT_MULTIPLIER } from '../constants'
import { EvmTransactionData } from '../types'

export async function buildEvmTransactionData(
    provider: Web3,
    originAddress: string,
    destinationAddress: string,
    amount: string,
    data: string | undefined
): Promise<EvmTransactionData> {
    const nonce = provider.utils.toHex(await provider.eth.getTransactionCount(originAddress))

    // Specified in wei = 1_000_000_000_000
    const gasPrice = await provider.eth.getGasPrice()
    const hexGasPrice = Converter.decimalToHex(Number(gasPrice), true)
    const estimatedGas = await provider.eth.estimateGas({ from: originAddress, to: destinationAddress, data })
    const gasLimit = Math.floor(estimatedGas * GAS_LIMIT_MULTIPLIER)

    const to = destinationAddress

    // Ether has 18 decimal places and the library expects a value in wei
    // Shimmer has 6 decimal places, so the difference is 12
    // We add 12 additional zeros to convert the glow to wei
    const value = getEvmTransactionValueFromAmount(amount)

    return { nonce, gasPrice: hexGasPrice, estimatedGas, gasLimit, to, value, data }
}
