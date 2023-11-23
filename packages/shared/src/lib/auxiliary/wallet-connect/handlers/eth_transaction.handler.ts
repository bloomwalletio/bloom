import { PopupId, openPopup } from '../../../../../../desktop/lib/auxiliary/popup'
import { TransactionConfig } from 'web3-core'
import { IChain } from '@core/network'
import { IConnectedDapp } from '@auxiliary/wallet-connect/interface'
import { findActiveAccountWithAddress } from '@core/profile/actions'
import { CallbackParameters } from '@auxiliary/wallet-connect/types'

export function handleEthTransaction(
    evmTransactionData: TransactionConfig,
    dapp: IConnectedDapp | undefined,
    chain: IChain,
    signAndSend: boolean,
    responseCallback: (params: CallbackParameters) => void
): void {
    if (!evmTransactionData.to || !evmTransactionData.from) {
        responseCallback({ error: 'No sender or recipient specified' })
        return
    }

    const account = findActiveAccountWithAddress(evmTransactionData.from.toString(), chain.getConfiguration().id)
    if (!account) {
        responseCallback({ error: 'Could not find address' })
        return
    }

    // What is required for a transaction
    // if () {
    // Build evm Transaction
    // }

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
