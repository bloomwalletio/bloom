import { handleEthSendTransaction } from './eth_sendTransaction.handler'
import { handleEthSign } from './eth_sign.handler'
import { handleEthSignTransaction } from './eth_signTransaction.handler'
import { handleEthSignTypedData } from './eth_signTypedData.handler'
import { handlePersonalSign } from './personal_sign.handler'
import { JsonRpcResponse } from '@walletconnect/jsonrpc-types'
import { Web3WalletTypes } from '@walletconnect/web3wallet'
import { getConnectedDappByOrigin, getWalletClient } from '../stores'
import { SupportedNetworkId, network } from '@core/network'
import { get } from 'svelte/store'

export function onSessionRequest(event: Web3WalletTypes.SessionRequest): void {
    const { topic, params, id: requestid, verifyContext } = event
    const { request, chainId } = params
    const method = request.method

    const dapp = getConnectedDappByOrigin(verifyContext.verified.origin)

    // TODO: the commented code is the correct one, but as long as there are no shimmerevm dapps, we need to hardcode it
    // const chain = get(network)?.getChain(chainId as NetworkId)
    const chain = get(network)?.getChain(SupportedNetworkId.ShimmerEvmTestnet ?? chainId)

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
            handlePersonalSign(requestid, request.params, dapp, chain, returnResponse)
            break
        case 'eth_signTypedData':
            handleEthSignTypedData()
            break
        default:
            break
    }
}
