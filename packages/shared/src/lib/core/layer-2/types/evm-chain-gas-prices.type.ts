import { EvmChainId } from '@core/network'

export type EvmChainGasPrices = {
    [key in EvmChainId]?: bigint
}
