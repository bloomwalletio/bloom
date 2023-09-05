import { EvmChainId } from '@core/network/enums'
import { NetworkId } from '@core/network/types'
import { getGasPriceFromProvider } from '../actions'
import { setEvmChainGasPrice } from '../stores'

const EVM_CHAIN_GAS_PRICE_POLLING_INTERVAL: number = 30_000

const pollIntervalMap: { [key in EvmChainId]?: number } = {}

export function pollEvmChainGasPrices(chainIds: NetworkId[]): void {
    stopPollingEvmChainGasPrices()
    for (const chainId of chainIds) {
        pollEvmChainGasPrice(chainId)
    }
}

export function pollEvmChainGasPrice(chainId: NetworkId): void {
    if (!chainId || typeof pollIntervalMap[chainId] === 'number') {
        return
    }
    void updateEvmChainGasPrice(chainId)
    pollIntervalMap[chainId] = window.setInterval(() => {
        void updateEvmChainGasPrice(chainId)
    }, EVM_CHAIN_GAS_PRICE_POLLING_INTERVAL)
}

export async function updateEvmChainGasPrice(chainId: NetworkId): Promise<void> {
    const gasPrice = await getGasPriceFromProvider(chainId)
    if (gasPrice) {
        setEvmChainGasPrice(BigInt(gasPrice), chainId)
    }
}

export function stopPollingEvmChainGasPrices(chainIdsToIgnore?: NetworkId[]): void {
    for (const chainId of Object.keys(pollIntervalMap)) {
        if (!chainIdsToIgnore?.includes(chainId as NetworkId)) {
            clearInterval(pollIntervalMap[chainId])
        }
    }
}
