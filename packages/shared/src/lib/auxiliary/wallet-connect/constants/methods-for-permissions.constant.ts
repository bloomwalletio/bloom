import { DappPermission } from '../enums/dapp-permission.enum'
import { RpcMethod } from '../enums/rpc-method.enum'

export const METHODS_FOR_PERMISSION = {
    [DappPermission.SignData]: [
        RpcMethod.EthSign,
        RpcMethod.PersonalSign,
        RpcMethod.EthSignTypedData,
        RpcMethod.EthSignTypedDataV3,
        RpcMethod.EthSignTypedDataV4,
    ],
    [DappPermission.SignTransaction]: [RpcMethod.EthSignTransaction],
    [DappPermission.SendTransaction]: [RpcMethod.EthSendTransaction, RpcMethod.EthSendRawTransaction],
}
