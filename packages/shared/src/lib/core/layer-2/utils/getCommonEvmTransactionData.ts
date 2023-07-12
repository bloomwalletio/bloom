import Web3 from 'web3'
import { GAS_MULTIPLIER } from '@core/layer-2/constants'
import { EvmTransactionData } from '@core/layer-2'

export async function getCommonEvmTransactionData(
    provider: Web3,
    originAddress: string,
    destinationAddress: string,
    value: string,
    data: string | undefined
): Promise<EvmTransactionData> {
    const nonce = provider.utils.toHex(await provider.eth.getTransactionCount(originAddress))

    const _gasPrice = await provider.eth.getGasPrice()
    const gasPrice = '0x' + _gasPrice

    const estimatedGas = await provider.eth.estimateGas({ from: originAddress, to: destinationAddress, data })
    const gasLimit = provider.utils.toHex(GAS_MULTIPLIER * estimatedGas) // Double to ensure we have enough gas

    const to = destinationAddress

    return { nonce, gasPrice, gasLimit, to, value: provider.utils.toHex(value + '000000000000'), data }
}
