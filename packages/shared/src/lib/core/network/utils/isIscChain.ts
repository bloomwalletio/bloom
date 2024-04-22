import { IEvmNetwork } from '@core/network/interfaces'
import { EvmNetworkType } from '../enums'
import type { IscChain } from '@core/network/classes'

export function isIscChain(network: IEvmNetwork): network is IscChain {
    return network.type === EvmNetworkType.Isc
}
