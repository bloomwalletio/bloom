import { Block, Transaction, TransactionReceipt, Log } from 'web3-types'
import { EthRpcMethod } from '../enums'

export type EthRpcResponses = {
    [EthRpcMethod.BlockNumber]: string
    [EthRpcMethod.GetBlockByNumber]: Block | null
    [EthRpcMethod.GetBlockByHash]: Block | null
    [EthRpcMethod.GetTransactionByHash]: Transaction | null
    [EthRpcMethod.GetTransactionReceipt]: TransactionReceipt | null
    [EthRpcMethod.Call]: string
    [EthRpcMethod.GetBalance]: string
    [EthRpcMethod.GetCode]: string
    [EthRpcMethod.GetLogs]: Log[]
    [EthRpcMethod.GetStorageAt]: string
    [EthRpcMethod.EstimateGas]: string
}
