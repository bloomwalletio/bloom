import { handleEthSendTransaction } from './eth_sendTransaction.handler'
import { handleSignMessage } from './sign_message.handler'
import { handleEthSignTransaction } from './eth_signTransaction.handler'
import { handleEthSignTypedData } from './eth_signTypedData.handler'
import { JsonRpcResponse } from '@walletconnect/jsonrpc-types'
import { Web3WalletTypes } from '@walletconnect/web3wallet'
import { getConnectedDappByOrigin, getWalletClient } from '../stores'
import { NetworkId, SupportedNetworkId, getNetwork } from '@core/network'
import { CallbackParameters } from '../types'
import { Platform } from '@core/app'

export function onSessionRequest(event: Web3WalletTypes.SessionRequest): void {
    Platform.focusWindow()

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
                  error: {
                      code: 5000,
                      message: error,
                  },
                  jsonrpc: '2.0',
              }
            : undefined

        if (response) {
            void getWalletClient()?.respondSessionRequest({ topic, response })
        }
    }

    // TODO: the commented code is the correct one, but as long as there are no shimmerevm dapps, we need to hardcode it
    // const chain = getNetwork()?.getChain(chainId as NetworkId)
    const chain = getNetwork()?.getChain(SupportedNetworkId.TestnetEvm ?? (chainId as NetworkId))
    if (!chain) {
        returnResponse({ error: 'Chain not supported' })
        return
    }

    switch (method) {
        case 'eth_sendTransaction':
            handleEthSendTransaction(request.params, returnResponse)
            break
        case 'eth_signTransaction':
            handleEthSignTransaction(request.params[0], dapp, chain, returnResponse)
            break
        case 'eth_sign':
        case 'personal_sign':
            handleSignMessage(request.params, dapp, method, chain, returnResponse)
            break
        case 'eth_signTypedData':
            handleEthSignTypedData()
            break
        default:
            break
    }
}
