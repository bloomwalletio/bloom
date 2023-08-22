import { getNetwork } from '@core/network/stores'
import { Converter } from '@core/utils'

export async function getGasPriceInWei(chainId: number | undefined): Promise<string | undefined> {
    if (!chainId) {
        return undefined
    }
    const chain = getNetwork()?.getChain(chainId)

    const provider = chain?.getProvider()
    if (!provider) {
        return undefined
    }

    const gasPrice = await provider.eth.getGasPrice()
    return Converter.decimalToHex(Number(gasPrice), true)
}
