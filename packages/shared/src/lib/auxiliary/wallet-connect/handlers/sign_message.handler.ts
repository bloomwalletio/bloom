import { Converter } from '@iota/util.js'
import { openPopup, PopupId } from '../../../../../../desktop/lib/auxiliary/popup'
import { IConnectedDapp } from '../interface'
import { IChain } from '@core/network'
import { CallbackParameters } from '../types'
import { switchToRequiredAccount } from '../utils'
import { getSdkError } from '@walletconnect/utils'
import { Platform } from '@core/app'
import { DappVerification, RpcMethod } from '../enums'
import { parseSiweMessage, validateSiwe } from '@core/layer-2'
import { showNotification } from '@auxiliary/notification'
import { localize } from '@core/i18n'

export async function handleSignMessage(
    params: unknown,
    dapp: IConnectedDapp,
    method: RpcMethod.PersonalSign | RpcMethod.EthSign,
    chain: IChain,
    responseCallback: (params: CallbackParameters) => void,
    verifiedState: DappVerification
): Promise<void> {
    if (!params || !Array.isArray(params)) {
        responseCallback({ error: getSdkError('INVALID_METHOD') })
        return
    }

    // Type for `eth_sign` params: [ address, hexMessage ]
    // Type for `personal_sign` params: [ hexMessage, address ]
    const hexMessage = method === RpcMethod.PersonalSign ? params[0] : params[1]
    const accountAddress = method === RpcMethod.PersonalSign ? params[1] : params[0]

    if (typeof hexMessage !== 'string') {
        responseCallback({ error: getSdkError('INVALID_METHOD') })
        return
    }
    const message = Converter.hexToUtf8(hexMessage)
    Platform.focusWindow()

    try {
        const account = await switchToRequiredAccount(accountAddress, chain)

        const siweObject = parseSiweMessage(message)
        if (siweObject) {
            const isValidSiwe = validateSiwe(siweObject, dapp.metadata?.url)
            if (isValidSiwe) {
                openPopup({
                    id: PopupId.Siwe,
                    props: {
                        siweObject,
                        rawMessage: message,
                        dapp,
                        account,
                        chain,
                        verifiedState,
                        callback: responseCallback,
                        onCancel: () => responseCallback({ error: getSdkError('USER_REJECTED') }),
                    },
                })
            } else {
                showNotification({
                    variant: 'error',
                    text: localize('notifications.siwe.rejected'),
                })
                responseCallback({ error: getSdkError('INVALID_METHOD') })
            }
        } else {
            openPopup({
                id: PopupId.SignMessage,
                props: {
                    message,
                    dapp,
                    account,
                    chain,
                    verifiedState,
                    callback: responseCallback,
                    onCancel: () => responseCallback({ error: getSdkError('USER_REJECTED') }),
                },
            })
        }
    } catch (err) {
        responseCallback({ error: getSdkError(err) })
    }
}
