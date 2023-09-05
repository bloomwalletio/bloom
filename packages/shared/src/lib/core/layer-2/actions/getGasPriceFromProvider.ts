import { NetworkId } from '@core/network/types'
import { getNetwork } from '@core/network/stores'
import { Converter } from '@core/utils'

export async function getGasPriceFromProvider(networkId: NetworkId): Promise<string | undefined> {
    const chain = getNetwork()?.getChain(networkId)

    const provider = chain?.getProvider()
    if (!provider) {
        return undefined
    }

    const gasPrice = await provider.eth.getGasPrice()
    return Converter.decimalToHex(Number(gasPrice), true)
}
