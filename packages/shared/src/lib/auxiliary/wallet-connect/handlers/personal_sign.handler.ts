import { Converter } from '@iota/util.js'
import { openPopup, PopupId } from '../../../../../../desktop/lib/auxiliary/popup'
import { JsonRpcResponse } from '@walletconnect/jsonrpc-types'
import { IConnectedDapp } from '../interface'
import { findActiveAccountWithAddress } from '@core/profile/actions'
import { IChain } from '@core/network'

export function handlePersonalSign(
    requestId: number,
    params: unknown,
    dapp: IConnectedDapp | undefined,
    chain: IChain,
    responseCallback: (response: JsonRpcResponse) => void
): void {
    if (!params || !Array.isArray(params)) {
        responseCallback({ id: requestId, error: { code: 5000, message: 'Unexpected format' }, jsonrpc: '2.0' })
        return
    }

    const hexMessage = params[0]
    if (typeof hexMessage !== 'string') {
        responseCallback({ id: requestId, error: { code: 5000, message: 'Unexpected message' }, jsonrpc: '2.0' })
        return
    }

    const account = findActiveAccountWithAddress(params[1], chain.getConfiguration().id)

    if (!account) {
        responseCallback({ id: requestId, error: { code: 5000, message: 'Could not find address' }, jsonrpc: '2.0' })
        return
    }
    const message = Converter.hexToUtf8(hexMessage)

    openPopup({
        id: PopupId.SignMessage,
        props: {
            id: requestId,
            message,
            dapp,
            account,
            chain,
            callback: responseCallback,
            onCancelled: () =>
                responseCallback({ id: requestId, error: { code: 5000, message: 'User rejected' }, jsonrpc: '2.0' }),
        },
    })
}
