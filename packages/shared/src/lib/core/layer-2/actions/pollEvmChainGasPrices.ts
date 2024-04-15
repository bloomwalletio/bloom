import { EvmNetworkId } from '@core/network/types'
import { MILLISECONDS_PER_SECOND } from '@core/utils'
import { updateEvmChainGasPrice } from './updateEvmChainGasPrice'

const EVM_CHAIN_GAS_PRICE_POLLING_INTERVAL: number = 60 * MILLISECONDS_PER_SECOND

const pollIntervalMap: { [id in EvmNetworkId]?: number } = {}

export function pollEvmChainGasPrice(networkId: EvmNetworkId): void {
    if (!networkId || isPollingEvmChainGasPrice(networkId)) {
        return
    }
    void updateEvmChainGasPrice(networkId)
    pollIntervalMap[networkId] = window.setInterval(() => {
        void updateEvmChainGasPrice(networkId)
    }, EVM_CHAIN_GAS_PRICE_POLLING_INTERVAL)
}

export function pollEvmChainGasPrices(networkIds: EvmNetworkId[]): void {
    stopPollingEvmChainGasPrices()
    for (const networkId of networkIds) {
        pollEvmChainGasPrice(networkId)
    }
}

export function stopPollingEvmChainGasPrices(networkIdsToIgnore?: EvmNetworkId[]): void {
    for (const networkId of Object.keys(pollIntervalMap) as EvmNetworkId[]) {
        if (!networkIdsToIgnore?.includes(networkId)) {
            if (isPollingEvmChainGasPrice(networkId)) {
                clearInterval(pollIntervalMap[networkId])
            }
        }
    }
}

export function isPollingEvmChainGasPrice(networkId: EvmNetworkId): boolean {
    return typeof pollIntervalMap[networkId] === 'number'
}
