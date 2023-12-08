import { handleSignMessage } from './sign_message.handler'
import { handleEthTransaction } from './eth_transaction.handler'
import { handleEthSignTypedData } from './eth_signTypedData.handler'
import { JsonRpcResponse } from '@walletconnect/jsonrpc-types'
import { Web3WalletTypes } from '@walletconnect/web3wallet'
import { getConnectedDappByOrigin, getWalletClient } from '../stores'
import { NetworkId, getNetwork } from '@core/network'
import { CallbackParameters } from '../types'
import { getSdkError } from '@walletconnect/utils'
import { closePopup } from '../../../../../../desktop/lib/auxiliary/popup'
import { handleWatchAsset } from './wallet_watchAsset.handler'

export function onSessionRequest(event: Web3WalletTypes.SessionRequest): void {
    const { topic, params, id, verifyContext } = event
    const { request, chainId } = params
    const method = request.method

    const dapp = getConnectedDappByOrigin(verifyContext.verified.origin)

    function returnResponse({ result, error }: CallbackParameters): void {
        const response: JsonRpcResponse | undefined = result
            ? {
                  id,
                  result,
                  jsonrpc: '2.0',
              }
            : error
            ? {
                  id,
                  error,
                  jsonrpc: '2.0',
              }
            : undefined

        if (response) {
            void getWalletClient()?.respondSessionRequest({ topic, response })
        }
        closePopup({ forceClose: true })
    }

    const chain = getNetwork()?.getChain(chainId as NetworkId)
    if (!chain) {
        returnResponse({ error: getSdkError('UNSUPPORTED_CHAINS') })
        return
    }

    const signAndSend = method === 'eth_sendTransaction'

    switch (method) {
        case 'eth_sendTransaction':
        case 'eth_signTransaction':
            void handleEthTransaction(request.params[0], dapp, chain, signAndSend, returnResponse)
            break
        case 'eth_sign':
        case 'personal_sign':
            void handleSignMessage(request.params, dapp, method, chain, returnResponse)
            break
        case 'eth_signTypedData':
            handleEthSignTypedData()
            break
        case 'wallet_watchAsset':
            void handleWatchAsset(request.params, dapp, chain, returnResponse)
            break
        default:
            break
    }
}
