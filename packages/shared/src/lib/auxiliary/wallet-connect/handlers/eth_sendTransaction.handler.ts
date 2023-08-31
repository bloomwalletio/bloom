import { CallbackParameters } from '../types'

export function handleEthSendTransaction(
    params: unknown,
    responseCallback: (params: CallbackParameters) => void
): void {
    if (!params || !Array.isArray(params)) {
        responseCallback({ error: 'Error' })
        return
    }

    const transactionObject = params[0]
    if (!transactionObject || typeof transactionObject !== 'object') {
        responseCallback({ error: 'Error' })
        return
    }

    // transactionObject = {
    //     "from": "0x0695883f9a3D651f2bfe115849e936f7808E4DEe",
    //     "to": "0x0695883f9a3D651f2bfe115849e936f7808E4DEe",
    //     "data": "0x",
    //     "nonce": "0x00",
    //     "gasPrice": "0x04d3a549a8",
    //     "gasLimit": "0x5208",
    //     "value": "0x00"
    // }
}
