import { DappPermission } from '../enums/dapp-permission.enum'

export const METHODS_FOR_PERMISSION = {
    [DappPermission.SignData]: ['eth_sign', 'personal_sign', 'eth_signTypedData'],
    [DappPermission.SignTransaction]: ['eth_signTransaction'],
    [DappPermission.SendTransaction]: ['eth_sendTransaction', 'eth_sendRawTransaction'],
}
