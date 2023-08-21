import { IClientOptions } from '../interfaces'
import { NetworkId } from '../types'
import { getDefaultNodes } from './getDefaultNodes'

export function getDefaultClientOptions(networkId: NetworkId): IClientOptions {
    const nodes = getDefaultNodes(networkId)
    return { nodes }
}
