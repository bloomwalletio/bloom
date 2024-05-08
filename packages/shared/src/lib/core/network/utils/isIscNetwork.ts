import { NetworkType } from '../enums'
import { IEvmNetwork, IIscChain } from '../interfaces'

export function isIscNetwork(network: IEvmNetwork): network is IIscChain {
    return network.type === NetworkType.Isc
}
