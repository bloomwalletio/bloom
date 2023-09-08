import { handleError } from '@core/error/handlers'
import { NetworkId } from '@core/network/types'
import { setEvmChainGasPrice } from '../stores'
import { getGasPriceForNetwork } from './getGasPriceForNetwork'

export async function updateEvmChainGasPrice(chainId: NetworkId): Promise<void> {
    try {
        const gasPrice = await getGasPriceForNetwork(chainId)
        if (gasPrice) {
            setEvmChainGasPrice(BigInt(gasPrice), chainId)
        }
    } catch (err) {
        handleError(err)
    }
}
