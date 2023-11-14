import { DappPermission } from '../enums/dapp-permission.enum'

export const METHODS_FOR_PERMISSION = {
    [DappPermission.SignData]: {
        eip155: ['eth_sign', 'personal_sign', 'eth_signTypedData'],
    },
    [DappPermission.SignTransaction]: {
        eip155: ['eth_signTransaction'],
    },
    [DappPermission.SendTransaction]: {
        eip155: ['eth_sendTransaction', 'eth_sendRawTransaction'],
    },
}
