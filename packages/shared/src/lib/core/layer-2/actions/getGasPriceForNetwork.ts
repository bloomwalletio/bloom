import { getChain } from '@core/network'
import { NetworkId } from '@core/network/types'
import { Converter } from '@core/utils'

export async function getGasPriceForNetwork(networkId: NetworkId): Promise<string | undefined> {
    const chain = getChain(networkId)
    if (!chain) {
        return undefined
    }

    const gasPrice = await chain.provider.eth.getGasPrice()
    return Converter.decimalToHex(Number(gasPrice), true)
}
