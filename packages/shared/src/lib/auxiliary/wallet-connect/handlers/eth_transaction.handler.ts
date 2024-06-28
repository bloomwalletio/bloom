import { WCRequestInfo } from '@auxiliary/wallet-connect/types'
import { getBloomError, switchToRequiredAccount } from '@auxiliary/wallet-connect/utils'
import { EvmTransactionData } from '@core/layer-2'
import { addGasBuffer } from '@core/layer-2/utils'
import { Converter } from '@core/utils'
import { getSdkError } from '@walletconnect/utils'
import { PopupId, openPopup } from '../../../../../../desktop/lib/auxiliary/popup'
import { Transaction } from 'web3'
import { RpcMethod } from '../enums/rpc-method.enum'

export async function handleEthTransaction(
    evmTransactionData: EvmTransactionData & { from: string; gas?: string },
    method: RpcMethod.EthSendTransaction | RpcMethod.EthSignTransaction | RpcMethod.EthSendRawTransaction,
    requestInfo: WCRequestInfo
): Promise<void> {
    const { to, from, gas, value, data } = evmTransactionData ?? {}
    const { evmNetwork, responseCallback } = requestInfo

    if (!from) {
        responseCallback({ error: getSdkError('INVALID_METHOD') })
        return
    }

    if (!data && !value) {
        responseCallback({ error: getSdkError('INVALID_METHOD') })
        return
    }

    if (to && typeof to !== 'string') {
        responseCallback({ error: getSdkError('INVALID_METHOD') })
        return
    }

    // Always override nonce with the latest value
    const nonce = await evmNetwork.provider.eth.getTransactionCount(from)
    evmTransactionData.nonce = nonce

    // Always get the latest gas price
    const gasPrice = await evmNetwork.getRequiredGasPrice()
    const hexGasPrice = Converter.decimalToHex(Number(gasPrice), true)
    evmTransactionData.gasPrice = hexGasPrice

    if (gas) {
        // Use the provided gas limit
        evmTransactionData.estimatedGas = Converter.hexToBigInt(gas)
    } else {
        try {
            const estimatedGas = await evmNetwork.provider.eth.estimateGas(evmTransactionData as Transaction)
            evmTransactionData.estimatedGas = estimatedGas
        } catch (err) {
            responseCallback(getBloomError(err))
            return
        }
    }

    const gasLimit = addGasBuffer(evmTransactionData.estimatedGas)
    evmTransactionData.gasLimit = gasLimit

    try {
        await switchToRequiredAccount(from, evmNetwork)
        openPopup({
            id: PopupId.EvmTransactionFromDapp,
            props: {
                preparedTransaction: evmTransactionData,
                requestInfo,
                method,
                onCancel: () => responseCallback({ error: getSdkError('USER_REJECTED') }),
            },
        })
    } catch (err) {
        responseCallback(getBloomError(err))
    }
}
