import { IConnectedDapp } from '@auxiliary/wallet-connect/interface'
import { CallbackParameters } from '@auxiliary/wallet-connect/types'
import { getBloomError, switchToRequiredAccount } from '@auxiliary/wallet-connect/utils'
import { Platform } from '@core/app'
import { EvmTransactionData } from '@core/layer-2'
import { addGasBuffer } from '@core/layer-2/utils'
import { IEvmNetwork } from '@core/network'
import { Converter } from '@core/utils'
import { getSdkError } from '@walletconnect/utils'
import { PopupId, openPopup } from '../../../../../../desktop/lib/auxiliary/popup'
import { DappVerification, RpcMethod } from '../enums'

export async function handleEthTransaction(
    evmTransactionData: EvmTransactionData & { from: string; gas?: string },
    dapp: IConnectedDapp | undefined,
    evmNetwork: IEvmNetwork,
    method: RpcMethod.EthSendTransaction | RpcMethod.EthSignTransaction | RpcMethod.EthSendRawTransaction,
    responseCallback: (params: CallbackParameters) => void,
    verifiedState: DappVerification
): Promise<void> {
    const { from, gas, value, data } = evmTransactionData ?? {}
    if (!from) {
        responseCallback({ error: getSdkError('INVALID_METHOD') })
        return
    }

    if (!data && !value) {
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
            const estimatedGas = await evmNetwork.provider.eth.estimateGas(evmTransactionData)
            evmTransactionData.estimatedGas = estimatedGas
        } catch (err) {
            responseCallback(getBloomError(err))
            return
        }
    }

    const gasLimit = addGasBuffer(evmTransactionData.estimatedGas)
    evmTransactionData.gasLimit = gasLimit

    Platform.focusWindow()

    try {
        await switchToRequiredAccount(from, evmNetwork)
        openPopup({
            id: PopupId.EvmTransactionFromDapp,
            props: {
                evmNetwork,
                dapp,
                preparedTransaction: evmTransactionData,
                method,
                verifiedState,
                callback: responseCallback,
                onCancel: () => responseCallback({ error: getSdkError('USER_REJECTED') }),
            },
        })
    } catch (err) {
        responseCallback(getBloomError(err))
    }
}
