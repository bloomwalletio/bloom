import { IChain } from '..'
import { getNetwork } from '../stores'
import { NetworkId } from '../types'

export function getChain(networkId: NetworkId): IChain | undefined {
    return getNetwork()?.getChain(networkId)
}
