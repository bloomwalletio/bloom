import { PopupId, openPopup } from '../../../../../../desktop/lib/auxiliary/popup'
import { IChain } from '@core/network'
import { IConnectedDapp } from '@auxiliary/wallet-connect/interface'
import { CallbackParameters } from '@auxiliary/wallet-connect/types'
import { buildEvmTransactionData } from '@core/layer-2/utils'
import { EvmTransactionData } from '@core/layer-2'
import { switchToRequiredAccount } from '@auxiliary/wallet-connect/utils'
import { getSdkError } from '@walletconnect/utils'
import { Platform } from '@core/app'
import { DappVerification, RpcMethod } from '../enums'

export async function handleEthTransaction(
    evmTransactionData: EvmTransactionData & { from: string },
    dapp: IConnectedDapp,
    chain: IChain,
    method: RpcMethod.EthSendTransaction | RpcMethod.EthSignTransaction | RpcMethod.EthSendRawTransaction,
    responseCallback: (params: CallbackParameters) => void,
    verifiedState: DappVerification
): Promise<void> {
    const { to, from, nonce, gasPrice, gasLimit, value, data } = evmTransactionData ?? {}
    if (!to || !from) {
        responseCallback({ error: getSdkError('INVALID_METHOD') })
        return
    }

    if (!data && !value) {
        responseCallback({ error: getSdkError('INVALID_METHOD') })
        return
    }

    if (!nonce || !gasPrice || !gasLimit) {
        try {
            const { nonce, gasPrice, gasLimit } = await buildEvmTransactionData(
                chain,
                from.toString(),
                to?.toString(),
                BigInt(value?.toString() ?? '0'),
                data?.toString()
            )
            evmTransactionData.nonce = nonce
            evmTransactionData.gasPrice = gasPrice
            evmTransactionData.gasLimit = gasLimit
        } catch (err) {
            responseCallback({
                error: {
                    message: err.message,
                    code: 1000,
                },
            })
            return
        }
    }

    Platform.focusWindow()

    try {
        await switchToRequiredAccount(from, chain)
        openPopup({
            id: PopupId.EvmTransactionFromDapp,
            props: {
                chain,
                dapp,
                preparedTransaction: evmTransactionData,
                method,
                verifiedState,
                callback: responseCallback,
                onCancel: () => responseCallback({ error: getSdkError('USER_REJECTED') }),
            },
        })
    } catch (err) {
        responseCallback({ error: getSdkError(err) })
    }
}
