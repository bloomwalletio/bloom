import { handleError } from '@core/error/handlers'
import { NetworkId, SupportedNetworkId, getNetwork } from '@core/network'
import { JsonRpcResponse } from '@walletconnect/jsonrpc-types'
import { getSdkError } from '@walletconnect/utils'
import { Web3WalletTypes } from '@walletconnect/web3wallet'
import { getConnectedDappByOrigin, getWalletClient, setConnectedDapps } from '../stores'
import { CallbackParameters } from '../types'
import { handleEthSignTypedData } from './eth_signTypedData.handler'
import { handleEthTransaction } from './eth_transaction.handler'
import { handleSignMessage } from './sign_message.handler'
import { handleWatchAsset } from '@auxiliary/wallet-connect/handlers'

export function onSessionRequest(event: Web3WalletTypes.SessionRequest): void {
    // We need to call this here, because if the dapp requests too fast after approval, we won't have the dapp in the store yet
    setConnectedDapps()
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
            try {
                void getWalletClient()?.respondSessionRequest({ topic, response })
            } catch (err) {
                handleError(err)
            }
        }
    }

    const chain = getNetwork()?.getChain(SupportedNetworkId.TestnetEvm)
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
        case 'eth_signTypedData_v3':
        case 'eth_signTypedData_v4':
            void handleEthSignTypedData(request.params, method, dapp, chain, returnResponse)
            break
        case 'wallet_watchAsset':
            void handleWatchAsset(request.params, dapp, chain, returnResponse)
            break
        default:
            returnResponse({ error: getSdkError('INVALID_METHOD') })
            break
    }
}
