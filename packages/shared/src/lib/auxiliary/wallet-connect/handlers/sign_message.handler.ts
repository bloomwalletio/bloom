import { Converter } from '@iota/util.js'
import { openPopup, PopupId } from '../../../../../../desktop/lib/auxiliary/popup'
import { IConnectedDapp } from '../interface'
import { IChain } from '@core/network'
import { CallbackParameters } from '../types'
import { switchToRequiredAccount } from '../utils'
import { getSdkError } from '@walletconnect/utils'
import { Platform } from '@core/app'
import { parseSiweMessage } from '@core/layer-2'

export async function handleSignMessage(
    params: unknown,
    dapp: IConnectedDapp | undefined,
    method: 'personal_sign' | 'eth_sign',
    chain: IChain,
    responseCallback: (params: CallbackParameters) => void
): Promise<void> {
    if (!params || !Array.isArray(params)) {
        responseCallback({ error: getSdkError('INVALID_METHOD') })
        return
    }

    // Type for `eth_sign` params: [ address, hexMessage ]
    // Type for `personal_sign` params: [ hexMessage, address ]
    const hexMessage = method === 'personal_sign' ? params[0] : params[1]
    const accountAddress = method === 'personal_sign' ? params[1] : params[0]

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
            openPopup({
                id: PopupId.Siwe,
                props: {
                    siweObject,
                    message,
                    dapp,
                    account,
                    chain,
                    callback: responseCallback,
                    onCancel: () => responseCallback({ error: getSdkError('USER_REJECTED') }),
                },
            })
        } else {
            openPopup({
                id: PopupId.SignMessage,
                props: {
                    message,
                    dapp,
                    account,
                    chain,
                    callback: responseCallback,
                    onCancel: () => responseCallback({ error: getSdkError('USER_REJECTED') }),
                },
            })
        }
    } catch (err) {
        responseCallback({ error: getSdkError(err) })
    }
}
