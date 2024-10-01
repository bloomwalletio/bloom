import { EthRpcMethod } from '../enums'
import { EthRpcParams, EthRpcResponses, NodeType } from '../types'
import { SupportedChain } from './noves-api-supported-chain.interface'

export interface INovesNodeplusApi {
    rpcPost<T extends EthRpcMethod>(
        method: T,
        chain: SupportedChain,
        nodeType: NodeType,
        params: EthRpcParams[T]
    ): Promise<EthRpcResponses[T] | undefined>
}
