import { Converter } from '@iota/util.js'
import { openPopup, PopupId } from '../../../../../../desktop/lib/auxiliary/popup'
import { IConnectedDapp } from '../interface'
import { findActiveAccountWithAddress } from '@core/profile/actions'
import { IChain } from '@core/network'
import { CallbackParameters } from '../types'

export function handleSignMessage(
    params: unknown,
    dapp: IConnectedDapp | undefined,
    method: 'personal_sign' | 'eth_sign',
    chain: IChain,
    responseCallback: (params: CallbackParameters) => void
): void {
    if (!params || !Array.isArray(params)) {
        responseCallback({ error: 'Unexpected format' })
        return
    }
    // Type for `eth_sign` params: [ address, hexMessage ]
    // Type for `personal_sign` params: [ hexMessage, address ]

    const hexMessage = method === 'personal_sign' ? params[0] : params[1]
    const accountAddress = method === 'personal_sign' ? params[1] : params[0]

    const account = findActiveAccountWithAddress(accountAddress, chain.getConfiguration().id)
    if (!account) {
        responseCallback({ error: 'Could not find address' })
        return
    }

    if (typeof hexMessage !== 'string') {
        responseCallback({ error: 'Unexpected message' })
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
            callback: responseCallback,
        },
    })
}
