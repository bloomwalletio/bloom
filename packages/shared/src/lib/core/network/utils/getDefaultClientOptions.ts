import { IClientOptions } from '../interfaces'
import { StardustNetworkId } from '../types'
import { getDefaultNodes } from './getDefaultNodes'

export function getDefaultClientOptions(networkId: StardustNetworkId): IClientOptions {
    const nodes = getDefaultNodes(networkId)
    return { nodes }
}
