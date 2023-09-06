import { NetworkId } from '@core/network/types'

export type EvmChainGasPrices = {
    [id in NetworkId]?: bigint
}
