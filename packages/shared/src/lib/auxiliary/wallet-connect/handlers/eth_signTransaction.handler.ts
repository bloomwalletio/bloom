import { PopupId, openPopup } from '../../../../../../desktop/lib/auxiliary/popup'
import { TransactionConfig } from 'web3-core'
import { IChain } from '@core/network'
import { IConnectedDapp } from '@auxiliary/wallet-connect/interface'
import { findActiveAccountWithAddress } from '@core/profile/actions'
import { CallbackParameters } from '@auxiliary/wallet-connect/types'
import { getSdkError } from '@walletconnect/utils'

export function handleEthSignTransaction(
    evmTransactionData: TransactionConfig,
    dapp: IConnectedDapp | undefined,
    chain: IChain,
    responseCallback: (params: CallbackParameters) => void
): void {
    if (!evmTransactionData.to) {
        return
    }

    const account = findActiveAccountWithAddress(evmTransactionData.from?.toString(), chain.getConfiguration().id)
    if (!account) {
        responseCallback({ error: getSdkError('UNSUPPORTED_ACCOUNTS') })
        return
    }

    openPopup({
        id: PopupId.SignEvmTransaction,
        props: {
            account,
            chain,
            dapp,
            transaction: evmTransactionData,
            callback: responseCallback,
            onCancel: () => responseCallback({ error: getSdkError('USER_REJECTED') }),
        },
    })
}
