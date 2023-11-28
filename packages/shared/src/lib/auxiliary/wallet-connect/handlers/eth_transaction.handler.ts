import { PopupId, openPopup } from '../../../../../../desktop/lib/auxiliary/popup'
import { IChain } from '@core/network'
import { IConnectedDapp } from '@auxiliary/wallet-connect/interface'
import { CallbackParameters } from '@auxiliary/wallet-connect/types'
import { buildEvmTransactionData } from '@core/layer-2/actions'
import { EvmTransactionData } from '@core/layer-2'
import { getSdkError } from '@walletconnect/utils'

export async function handleEthTransaction(
    evmTransactionData: EvmTransactionData & { from: string },
    dapp: IConnectedDapp | undefined,
    chain: IChain,
    signAndSend: boolean,
    responseCallback: (params: CallbackParameters) => void
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
        const { nonce, gasPrice, gasLimit } = await buildEvmTransactionData(
            chain,
            from,
            to?.toString(),
            value?.toString() ?? '0',
            data?.toString()
        )
        evmTransactionData.nonce = nonce
        evmTransactionData.gasPrice = gasPrice
        evmTransactionData.gasLimit = gasLimit
    }

    openPopup({
        id: PopupId.EvmTransactionFromDapp,
        props: {
            chain,
            dapp,
            preparedTransaction: evmTransactionData,
            signAndSend,
            callback: responseCallback,
            onCancel: () => responseCallback({ error: getSdkError('USER_REJECTED') }),
        },
    })
}
