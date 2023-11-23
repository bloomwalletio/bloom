import { PopupId, openPopup } from '../../../../../../desktop/lib/auxiliary/popup'
import { IChain } from '@core/network'
import { IConnectedDapp } from '@auxiliary/wallet-connect/interface'
import { findActiveAccountWithAddress } from '@core/profile/actions'
import { CallbackParameters } from '@auxiliary/wallet-connect/types'
import { buildEvmTransactionData } from '@core/layer-2/actions'
import { EvmTransactionData } from '@core/layer-2'

export async function handleEthTransaction(
    evmTransactionData: EvmTransactionData & { from: string },
    dapp: IConnectedDapp | undefined,
    chain: IChain,
    signAndSend: boolean,
    responseCallback: (params: CallbackParameters) => void
): Promise<void> {
    const { to, from, nonce, gasPrice, gasLimit, value, data } = evmTransactionData ?? {}
    if (!to || !from) {
        responseCallback({ error: 'No sender or recipient specified!' })
        return
    }

    const sender = from?.toString()
    const account = findActiveAccountWithAddress(sender, chain.getConfiguration().id)
    if (!account) {
        responseCallback({ error: 'Could not find address!' })
        return
    }

    if (!data && !value) {
        responseCallback({ error: 'Invalid transaction: must contain data or value field!' })
        return
    }

    if (!nonce || !gasPrice || !gasLimit) {
        const { nonce, gasPrice, gasLimit } = await buildEvmTransactionData(
            chain,
            sender,
            to?.toString(),
            value?.toString() ?? '0',
            data?.toString()
        )
        evmTransactionData.nonce = nonce
        evmTransactionData.gasPrice = gasPrice
        evmTransactionData.gasLimit = gasLimit
    }

    openPopup({
        id: PopupId.SignEvmTransaction,
        props: {
            account,
            chain,
            dapp,
            transaction: evmTransactionData,
            signAndSend,
            callback: responseCallback,
        },
    })
}
