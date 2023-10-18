import { IClientOptions as ClientOptions, INode } from '@iota/sdk/out/types'

export interface IClientOptions extends Omit<ClientOptions, 'nodes' | 'primaryNode'> {
    primaryNode?: INode
    nodes?: INode[]
}
