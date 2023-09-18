import { getNetwork } from '@core/network/stores'
import { NetworkId } from '@core/network/types'
import { Converter } from '@core/utils'

export async function getGasPriceForNetwork(networkId: NetworkId): Promise<string | undefined> {
    const chain = getNetwork()?.getChain(networkId)

    const provider = chain?.getProvider()
    if (!provider) {
        return undefined
    }

    const gasPrice = await provider.eth.getGasPrice()
    return Converter.decimalToHex(Number(gasPrice), true)
}
