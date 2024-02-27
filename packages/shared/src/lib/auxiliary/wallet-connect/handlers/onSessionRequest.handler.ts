import { handleError } from '@core/error/handlers'
import { NetworkId, getNetwork } from '@core/network'
import { JsonRpcResponse } from '@walletconnect/jsonrpc-types'
import { getSdkError } from '@walletconnect/utils'
import { Web3WalletTypes } from '@walletconnect/web3wallet'
import { getConnectedDappByOrigin, getWalletClient, setConnectedDapps } from '../stores'
import { CallbackParameters } from '../types'
import { handleEthSignTypedData } from './eth_signTypedData.handler'
import { handleEthTransaction } from './eth_transaction.handler'
import { handleSignMessage } from './sign_message.handler'
import { handleWatchAsset } from '@auxiliary/wallet-connect/handlers'
import { DappVerification } from '../enums'
import { getEvmTransactionFromHexString } from '@core/layer-2'

export function onSessionRequest(event: Web3WalletTypes.SessionRequest): void {
    // We need to call this here, because if the dapp requests too fast after approval, we won't have the dapp in the store yet
    setConnectedDapps()
    const { topic, params, id, verifyContext } = event
    const { request, chainId } = params
    const method = request.method

    const dapp = getConnectedDappByOrigin(verifyContext.verified.origin)
    const verifiedState: DappVerification = verifyContext.verified.isScam
        ? DappVerification.Scam
        : (verifyContext.verified.validation as DappVerification)

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

    if (!dapp) {
        returnResponse({ error: getSdkError('SESSION_SETTLEMENT_FAILED') })
        return
    }

    const chain = getNetwork()?.getChain(chainId as NetworkId)
    if (!chain) {
        returnResponse({ error: getSdkError('UNSUPPORTED_CHAINS') })
        return
    }

    switch (method) {
        case 'eth_sendTransaction':
        case 'eth_signTransaction':
        case 'eth_sendRawTransaction': {
            const evmTransactionData =
                method === 'eth_sendRawTransaction'
                    ? getEvmTransactionFromHexString(request.params[0])
                    : request.params[0]

            void handleEthTransaction(evmTransactionData, dapp, chain, method, returnResponse, verifiedState)
            break
        }
        case 'eth_sign':
        case 'personal_sign':
            void handleSignMessage(request.params, dapp, method, chain, returnResponse, verifiedState)
            break
        case 'eth_signTypedData':
        case 'eth_signTypedData_v3':
        case 'eth_signTypedData_v4':
            void handleEthSignTypedData(request.params, method, dapp, chain, returnResponse, verifiedState)
            break
        case 'wallet_watchAsset':
            void handleWatchAsset(request.params, dapp, chain, returnResponse)
            break
        default:
            returnResponse({ error: getSdkError('INVALID_METHOD') })
            break
    }
}
