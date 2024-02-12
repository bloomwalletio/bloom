import { DappPermission } from '../enums/dapp-permission.enum'

export const METHODS_FOR_PERMISSION = {
    [DappPermission.SignData]: [
        'eth_sign',
        'personal_sign',
        'eth_signTypedData',
        'eth_signTypedData_v3',
        'eth_signTypedData_v4',
    ],
    [DappPermission.SignTransaction]: ['eth_signTransaction'],
    [DappPermission.SendTransaction]: ['eth_sendTransaction', 'eth_sendRawTransaction'],
}
