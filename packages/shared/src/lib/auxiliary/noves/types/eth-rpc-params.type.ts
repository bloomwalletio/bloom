import { EthRpcMethod } from '../enums'

export type EthRpcParams = {
    [EthRpcMethod.BlockNumber]: []
    [EthRpcMethod.GetBlockByNumber]: [string | number, boolean] // Block number or "latest", include transactions
    [EthRpcMethod.GetBlockByHash]: [string, boolean] // Block hash, include transactions
    [EthRpcMethod.GetTransactionByHash]: [string] // Transaction hash
    [EthRpcMethod.GetTransactionReceipt]: [string] // Transaction hash
    [EthRpcMethod.Call]: [
        {
            to: string
            from?: string
            gas?: string
            gasPrice?: string
            value?: string
            data?: string
        },
        string | number,
    ] // Transaction object, block number or "latest"
    [EthRpcMethod.GetBalance]: [string, string | number] // Address, block number or "latest"
    [EthRpcMethod.GetCode]: [string, string | number] // Address, block number or "latest"
    [EthRpcMethod.GetLogs]: [
        {
            address?: string
            topics?: (string | null)[]
            fromBlock?: string | number
            toBlock?: string | number
        },
    ] // Filter options: address, topics, fromBlock, toBlock
    [EthRpcMethod.GetStorageAt]: [string, string, string | number] // Contract address, position, block number or "latest"
    [EthRpcMethod.EstimateGas]: [
        {
            to?: string
            from?: string
            gas?: string
            gasPrice?: string
            value?: string
            data?: string
        },
    ] // Transaction object
}
