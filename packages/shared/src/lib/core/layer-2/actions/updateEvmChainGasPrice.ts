import { handleError } from '@core/error/handlers'
import { NetworkId } from '@core/network/types'
import { setEvmChainGasPrice } from '../stores'
import { getGasPriceFromProvider } from './getGasPriceFromProvider'

export async function updateEvmChainGasPrice(chainId: NetworkId): Promise<void> {
    try {
        const gasPrice = await getGasPriceFromProvider(chainId)
        if (gasPrice) {
            setEvmChainGasPrice(BigInt(gasPrice), chainId)
        }
    } catch (err) {
        handleError(err)
    }
}
