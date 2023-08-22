import { IClientOptions as ClientOptions } from '@iota/sdk/out/types'

import { INode } from './node.interface'

export interface IClientOptions extends Omit<ClientOptions, 'nodes' | 'primaryNode'> {
    primaryNode?: INode
    nodes?: INode[]
}
