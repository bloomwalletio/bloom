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
import { TransactionFactory } from '@ethereumjs/tx'
import { Converter } from '@core/utils'

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
            void handleEthTransaction(request.params[0], dapp, chain, method, returnResponse, verifiedState)
            break
        case 'eth_sendRawTransaction': {
            const _transaction =
                '0xf8667d85e8d4a510008252089462755b3cd128d8622fd82444f49d19009a6d950f8080820885a08ec84d65d3af77a4233de2f7d090c82d5381f67c175a5d30d7ef33704d458f45a038dfc68b809961e01ca6d21b567fdf35e7f1771143c1268209cc475df5538507'
            const transactionData = TransactionFactory.fromSerializedData(Converter.hexToBytes(_transaction)).toJSON()
            const transaction = TransactionFactory.fromTxData(transactionData)
            const sender = transaction.getSenderAddress().toString()

            void handleEthTransaction(
                { ...transaction, from: sender },
                dapp,
                chain,
                method,
                returnResponse,
                verifiedState
            )
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
