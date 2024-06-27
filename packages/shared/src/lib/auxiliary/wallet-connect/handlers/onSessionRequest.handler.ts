import { handleError } from '@core/error/handlers'
import { NetworkId, getEvmNetwork } from '@core/network'
import { JsonRpcResponse } from '@walletconnect/jsonrpc-types'
import { getSdkError } from '@walletconnect/utils'
import { Web3WalletTypes } from '@walletconnect/web3wallet'
import {
    getConnectedDappBySessionTopic,
    getWalletClient,
    setConnectedDapps,
    updateVerificationStateForDapp,
} from '../stores'
import { CallbackParameters, WCRequestInfo } from '../types'
import { handleEthSignTypedData } from './eth_signTypedData.handler'
import { handleEthTransaction } from './eth_transaction.handler'
import { handleSignMessage } from './sign_message.handler'
import { handleWatchAsset } from '@auxiliary/wallet-connect/handlers'
import { DappVerification, RpcMethod } from '../enums'
import { EvmTransactionData, getEvmTransactionFromHexString } from '@core/layer-2'
import { activeProfileId } from '@core/profile/stores'
import { get } from 'svelte/store'
import { Platform } from '@core/app/classes'

export function onSessionRequest(event: Web3WalletTypes.SessionRequest): void {
    // We need to call this here, because if the dapp requests too fast after approval, we won't have the dapp in the store yet
    setConnectedDapps()
    const { topic, params, id, verifyContext } = event
    const { request, chainId } = params
    const method = request.method as RpcMethod

    // This field is not yet added to the walletconnect types
    const expiryTimestamp = (request as unknown as { expiryTimestamp: number }).expiryTimestamp

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

    Platform.focusWindow()

    if (!get(activeProfileId)) {
        returnResponse({ error: getSdkError('SESSION_SETTLEMENT_FAILED') })
        return
    }

    const dapp = getConnectedDappBySessionTopic(topic)
    const verifiedState = verifyContext.verified.isScam
        ? DappVerification.Scam
        : (verifyContext.verified.validation as DappVerification)
    updateVerificationStateForDapp(verifyContext.verified.origin, verifiedState)

    if (!dapp) {
        returnResponse({ error: getSdkError('SESSION_SETTLEMENT_FAILED') })
        return
    }

    const evmNetwork = getEvmNetwork(chainId as NetworkId)
    if (!evmNetwork) {
        returnResponse({ error: getSdkError('UNSUPPORTED_CHAINS') })
        return
    }

    const requestData: WCRequestInfo = {
        dapp,
        evmNetwork,
        method,
        responseCallback: returnResponse,
        verifiedState,
        expiryTimestamp,
    }

    switch (method) {
        case RpcMethod.EthSendTransaction:
        case RpcMethod.EthSignTransaction:
        case RpcMethod.EthSendRawTransaction: {
            const evmTransactionData: EvmTransactionData & { from: string } =
                method === RpcMethod.EthSendRawTransaction
                    ? getEvmTransactionFromHexString(request.params[0])
                    : request.params[0]

            void handleEthTransaction(evmTransactionData, method, requestData)
            break
        }
        case RpcMethod.EthSign:
        case RpcMethod.PersonalSign:
            void handleSignMessage(request.params, method, requestData)
            break
        case RpcMethod.EthSignTypedData:
        case RpcMethod.EthSignTypedDataV3:
        case RpcMethod.EthSignTypedDataV4:
            void handleEthSignTypedData(request.params, method, requestData)
            break
        case RpcMethod.WalletWatchAsset:
            void handleWatchAsset(request.params, requestData)
            break
        default:
            returnResponse({ error: getSdkError('INVALID_METHOD') })
            break
    }
}
