import { NetworkId } from '@core/network/types'
import { getNetwork } from '@core/network/stores'
import { Converter } from '@core/utils'

export async function getGasPriceForNetwork(networkId: NetworkId): Promise<string | undefined> {
    const chain = getNetwork()?.getChain(networkId)
    if (!chain) {
        return undefined
    }

    const gasPrice = await chain.provider.eth.getGasPrice()
    return Converter.decimalToHex(Number(gasPrice), true)
}
