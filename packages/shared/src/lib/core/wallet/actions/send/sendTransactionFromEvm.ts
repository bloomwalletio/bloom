import { getSelectedAccount } from '@core/account/stores'
import { addPersistedTransaction } from '@core/activity/stores'
import { EvmTransactionData } from '@core/layer-2'
import { LedgerAppName } from '@core/ledger'
import { IChain } from '@core/network'
import { checkActiveProfileAuth } from '@core/profile/actions'
import { signAndSendEvmTransaction } from './signAndSendEvmTransaction'
import { TransactionReceipt } from 'web3-core'

export async function sendTransactionFromEvm(
    transaction: EvmTransactionData,
    chain: IChain,
    callback?: () => void
): Promise<TransactionReceipt | undefined> {
    const account = getSelectedAccount()
    const provider = chain.getProvider()
    if (!account) {
        return
    }

    const chainId = chain.getConfiguration().chainId
    let transactionReceipt: TransactionReceipt | undefined
    await checkActiveProfileAuth(
        async () => {
            transactionReceipt = await signAndSendEvmTransaction(transaction, chainId, provider, account)
            if (transactionReceipt) {
                addPersistedTransaction(account.index, chainId, {
                    ...transaction,
                    ...transactionReceipt,
                })
            }
            if (callback && typeof callback === 'function') {
                callback()
            }
        },
        { stronghold: false, ledger: true },
        LedgerAppName.Ethereum
    )
    return transactionReceipt
}
