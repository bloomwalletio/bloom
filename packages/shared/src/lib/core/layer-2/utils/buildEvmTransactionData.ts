import { IEvmNetwork } from '@core/network'
import { Converter, HEX_PREFIX } from '@core/utils'
import { EvmTransactionData } from '../types'
import { addGasBuffer } from './addGasBuffer'

export async function buildEvmTransactionData(
    evmNetwork: IEvmNetwork,
    originAddress: string,
    destinationAddress: string,
    amount: bigint,
    data: string | undefined
): Promise<EvmTransactionData> {
    const nonce = await evmNetwork.provider.eth.getTransactionCount(originAddress)
    const gasPrice = await evmNetwork.getRequiredGasPrice()
    const hexGasPrice = Converter.decimalToHex(Number(gasPrice), true)
    const estimatedGas = await evmNetwork.provider.eth.estimateGas({
        from: originAddress,
        to: destinationAddress,
        data,
        value: amount.toString(),
    })
    const gasLimit = addGasBuffer(estimatedGas)

    const to = destinationAddress

    const value = HEX_PREFIX + amount.toString(16)
    return { nonce, gasPrice: hexGasPrice, estimatedGas, gasLimit, to, value, data }
}
