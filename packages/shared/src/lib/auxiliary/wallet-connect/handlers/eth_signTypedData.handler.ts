import { IChain } from '@core/network'
import { IConnectedDapp } from '../interface'
import { CallbackParameters } from '../types'
import { PopupId, openPopup } from '../../../../../../desktop/lib/auxiliary/popup'
import { switchToRequiredAccount } from '../utils'
import { getSdkError } from '@walletconnect/utils'
import { Platform } from '@core/app/classes'
import { SignTypedDataVersion } from '@metamask/eth-sig-util'

export async function handleEthSignTypedData(
    params: unknown,
    method: string,
    dapp: IConnectedDapp | undefined,
    chain: IChain,
    responseCallback: (params: CallbackParameters) => void
): Promise<void> {
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

    Platform.focusWindow()

    try {
        const account = await switchToRequiredAccount(accountAddress, chain)
        openPopup({
            id: PopupId.SignTypedData,
            props: {
                data: stringifiedData,
                version,
                dapp,
                account,
                chain,
                callback: responseCallback,
                onCancel: () => responseCallback({ error: getSdkError('USER_REJECTED') }),
            },
        })
    } catch (err) {
        responseCallback({ error: getSdkError(err) })
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
