import { Converter } from '@iota/util.js'
import { openPopup, PopupId } from '../../../../../../desktop/lib/auxiliary/popup'
import { IConnectedDapp } from '../interface'
import { findActiveAccountWithAddress } from '@core/profile/actions'
import { IChain } from '@core/network'
import { CallbackParameters } from '../types'

// Type for `personal_sign` params: [ hexMessage, address ]
export function handlePersonalSign(
    params: unknown,
    dapp: IConnectedDapp | undefined,
    chain: IChain,
    responseCallback: (params: CallbackParameters) => void
): void {
    if (!params || !Array.isArray(params)) {
        responseCallback({ error: 'Unexpected format' })
        return
    }

    const hexMessage = params[0]
    if (typeof hexMessage !== 'string') {
        responseCallback({ error: 'Unexpected message' })
        return
    }

    const account = findActiveAccountWithAddress(params[1], chain.getConfiguration().id)
    if (!account) {
        responseCallback({ error: 'Could not find address' })
        return
    }
    const message = Converter.hexToUtf8(hexMessage)

    openPopup({
        id: PopupId.SignMessage,
        props: {
            message,
            dapp,
            account,
            chain,
            method: 'personal_sign',
            callback: responseCallback,
        },
    })
}
