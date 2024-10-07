export enum EthRpcMethod {
    BlockNumber = 'eth_blockNumber',
    GetBlockByNumber = 'eth_getBlockByNumber',
    GetBlockByHash = 'eth_getBlockByHash',
    GetTransactionByHash = 'eth_getTransactionByHash',
    GetTransactionReceipt = 'eth_getTransactionReceipt',
    Call = 'eth_call',
    GetBalance = 'eth_getBalance',
    GetCode = 'eth_getCode',
    GetLogs = 'eth_getLogs',
    GetStorageAt = 'eth_getStorageAt',
    EstimateGas = 'eth_estimateGas',
}
