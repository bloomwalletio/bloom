import { EthRpcMethod } from '../enums'
import { SupportedChain } from '../interfaces'
import { EthRpcParams, EthRpcResponses, NodeType } from '../types'
import { NovesBaseApi } from './noves-base.api'

export class NovesNodePlusApi extends NovesBaseApi {
    constructor() {
        super('https://rpc.noves.fi')
    }

    async rpcPost<T extends EthRpcMethod>(
        method: T,
        chain: SupportedChain,
        nodeType: NodeType,
        params: EthRpcParams[T]
    ): Promise<EthRpcResponses[T] | undefined> {
        const response = await this.post<EthRpcResponses[T]>({
            path: `${chain.name}_${nodeType}`,
            body: JSON.stringify({
                method,
                params,
                id: 1,
                jsonrpc: '2.0',
            }),
        })
        return response
    }
}
