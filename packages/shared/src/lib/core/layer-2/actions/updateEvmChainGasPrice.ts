import { handleError } from '@core/error/handlers'
import { getNetwork } from '@core/network/stores'
import { NetworkId } from '@core/network/types'
import { setEvmChainGasPrice } from '../stores'
import { getGasPriceForNetwork } from './getGasPriceForNetwork'

export async function updateEvmChainGasPrice(networkId: NetworkId): Promise<void> {
    try {
        const gasPrice = await getGasPriceForNetwork(networkId)
        if (gasPrice) {
            setEvmChainGasPrice(BigInt(gasPrice), networkId)
        }
    } catch (err) {
        handleError(err)
    }
}

export async function updateEvmChainGasPrices(): Promise<void> {
    const chainNetworkIds =
        getNetwork()
            ?.getChains()
            ?.map((chain) => chain.getConfiguration().id) ?? []
    await Promise.all(chainNetworkIds.map((chainId) => updateEvmChainGasPrice(chainId)))
}
