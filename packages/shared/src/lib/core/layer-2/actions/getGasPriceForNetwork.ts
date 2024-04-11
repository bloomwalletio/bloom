import { getEvmNetwork } from '@core/network'
import { NetworkId } from '@core/network/types'
import { Converter } from '@core/utils'

export async function getGasPriceForNetwork(networkId: NetworkId): Promise<string | undefined> {
    const evmNetwork = getEvmNetwork(networkId)
    if (!evmNetwork) {
        return undefined
    }

    const gasPrice = await evmNetwork.provider.eth.getGasPrice()
    return Converter.decimalToHex(Number(gasPrice), true)
}
