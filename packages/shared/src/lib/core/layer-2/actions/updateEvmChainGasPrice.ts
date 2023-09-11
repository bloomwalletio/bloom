import { handleError } from '@core/error/handlers'
import { NetworkId } from '@core/network/types'
import { setEvmChainGasPrice } from '../stores'
import { getGasPriceForNetwork } from './getGasPriceForNetwork'
import { getNetwork } from '@core/network'

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

export async function updateEvmChainGasPrices(networkIds?: NetworkId[]): Promise<void> {
    const profileChainIds =
        getNetwork()
            ?.getChains()
            ?.map((chain) => chain.getConfiguration().id) ?? []
    const chainsToQuery = networkIds ? networkIds : profileChainIds
    await Promise.all(chainsToQuery.map((chainId) => updateEvmChainGasPrice(chainId)))
}
