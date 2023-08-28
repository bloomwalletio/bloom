import { handleEthSendTransaction } from './eth_sendTransaction.handler'
import { handleEthSign } from './eth_sign.handler'
import { handleEthSignTransaction } from './eth_signTransaction.handler'
import { handleEthSignTypedData } from './eth_signTypedData.handler'
import { handlePersonalSign } from './personal_sign.handler'
import { JsonRpcResponse } from '@walletconnect/jsonrpc-types'
import { Web3WalletTypes } from '@walletconnect/web3wallet'
import { getConnectedDappByOrigin, getWalletClient } from '../stores'

export function onSessionRequest(event: Web3WalletTypes.SessionRequest): void {
    const { topic, params, id: requestid, verifyContext } = event
    const { request } = params
    // TODO: to access the chain for which we want to do the action: params.chainId
    const method = request.method

    const dapp = getConnectedDappByOrigin(verifyContext.verified.origin)

    function returnResponse(response: JsonRpcResponse): void {
        void getWalletClient()?.respondSessionRequest({ topic, response })
    }

    switch (method) {
        case 'eth_sendTransaction':
            handleEthSendTransaction(requestid, request.params, returnResponse)
            break
        case 'eth_signTransaction':
            handleEthSignTransaction()
            break
        case 'eth_sign':
            handleEthSign()
            break
        case 'personal_sign':
            handlePersonalSign(requestid, request.params, dapp, returnResponse)
            break
        case 'eth_signTypedData':
            handleEthSignTypedData()
            break
        default:
            break
    }
}
