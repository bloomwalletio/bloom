import { PopupId, openPopup } from '../../../../../../desktop/lib/auxiliary/popup'
import { getBloomError, switchToRequiredAccount } from '../utils'
import { getSdkError } from '@walletconnect/utils'
import { SignTypedDataVersion } from '@metamask/eth-sig-util'
import { localize } from '@core/i18n'
import { WCRequestInfo } from '../types'
import { RpcMethod } from '../enums/rpc-method.enum'

export async function handleEthSignTypedData(
    params: unknown,
    method: RpcMethod.EthSignTypedData | RpcMethod.EthSignTypedDataV3 | RpcMethod.EthSignTypedDataV4,
    requestInfo: WCRequestInfo
): Promise<void> {
    const { evmNetwork, responseCallback } = requestInfo

    if (!params || !Array.isArray(params)) {
        responseCallback({ error: getSdkError('INVALID_METHOD') })
        return
    }

    const accountAddress = params[0]
    const stringifiedData = params[1]

    if (typeof stringifiedData !== 'string') {
        responseCallback({ error: getSdkError('INVALID_METHOD') })
        return
    }

    const version = getVersion(method)
    if (version === SignTypedDataVersion.V1) {
        responseCallback({ error: { code: 501, message: localize('error.walletConnect.signTypedData') } })
        return
    }

    try {
        const account = await switchToRequiredAccount(accountAddress, evmNetwork)
        openPopup({
            id: PopupId.SignTypedData,
            props: {
                data: stringifiedData,
                version,
                account,
                requestInfo,
                onCancel: () => responseCallback({ error: getSdkError('USER_REJECTED') }),
            },
        })
    } catch (err) {
        responseCallback(getBloomError(err))
    }

    return
}

function getVersion(method: string): SignTypedDataVersion {
    const versionSuffix = method.slice(-2)

    switch (versionSuffix) {
        case 'v4':
            return SignTypedDataVersion.V4
        case 'v3':
            return SignTypedDataVersion.V3
        default:
            return SignTypedDataVersion.V1
    }
}
