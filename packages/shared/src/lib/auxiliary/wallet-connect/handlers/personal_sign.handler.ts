import { Converter } from '@iota/util.js'
import { openPopup, PopupId } from '../../../../../../desktop/lib/auxiliary/popup'
import { JsonRpcResponse } from '@walletconnect/jsonrpc-types'
import { IConnectedDapp } from '../interface'

export function handlePersonalSign(
    requestid: number,
    params: unknown,
    dapp: IConnectedDapp,
    responseCallback: (response: JsonRpcResponse) => void
): void {
    if (!params || !Array.isArray(params)) {
        responseCallback({ id: requestid, error: { code: 5000, message: 'Error' }, jsonrpc: '2.0' })
        return
    }

    const hexMessage = params[0]
    if (typeof hexMessage !== 'string') {
        responseCallback({ id: requestid, error: { code: 5000, message: 'Error' }, jsonrpc: '2.0' })
        return
    }

    // to access the address for which we want to do the action = params[1]

    const message = Converter.hexToUtf8(hexMessage)

    openPopup({
        id: PopupId.SignMessage,
        props: {
            id: requestid,
            message,
            dapp,
            callback: responseCallback,
        },
    })
}
