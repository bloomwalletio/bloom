import Web3 from 'web3'
import { GAS_MULTIPLIER, WEI_PER_GLOW } from '../constants'
import { EvmTransactionData } from '../types'

export async function buildEvmTransactionData(
    provider: Web3,
    originAddress: string,
    destinationAddress: string,
    amount: string,
    data: string | undefined
): Promise<EvmTransactionData> {
    const nonce = provider.utils.toHex(await provider.eth.getTransactionCount(originAddress))

    const _gasPrice = await provider.eth.getGasPrice()
    const gasPrice = '0x' + _gasPrice

    const estimatedGas = await provider.eth.estimateGas({ from: originAddress, to: destinationAddress, data })
    const gasLimit = provider.utils.toHex(GAS_MULTIPLIER * estimatedGas) // Double to ensure we have enough gas

    const to = destinationAddress

    // Ether has 18 decimal places and the library expects a value in wei
    // Shimmer has 6 decimal places, so the difference is 12
    // We add 12 additional zeros to convert the glow to wei
    const rawValue = BigInt(BigInt(amount) * WEI_PER_GLOW)
    const value = '0x' + rawValue.toString(16)

    return { nonce, gasPrice, gasLimit, to, value, data }
}
