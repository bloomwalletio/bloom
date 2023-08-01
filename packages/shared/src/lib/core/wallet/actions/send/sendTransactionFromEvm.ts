import { getSelectedAccount } from '@core/account'
import { EvmTransactionData } from '@core/layer-2'
import { LedgerAppName } from '@core/ledger'
import { IChain } from '@core/network'
import { checkActiveProfileAuth } from '@core/profile'
import { signAndSendEvmTransaction } from './signAndSendEvmTransaction'
import { addPersistedTransaction } from '@core/activities/stores'

export async function sendTransactionFromEvm(
    transaction: EvmTransactionData,
    chain: IChain,
    callback: () => void
): Promise<void> {
    const account = getSelectedAccount()
    const provider = chain.getProvider()
    if (!account) {
        return
    }

    await checkActiveProfileAuth(
        async () => {
            const transactionReceipt = await signAndSendEvmTransaction(transaction, provider, account.index)
            if (transactionReceipt) {
                addPersistedTransaction(account.index, chain.getConfiguration().chainId, {
                    ...transaction,
                    ...transactionReceipt,
                })
            }
            callback()
        },
        { stronghold: true, ledger: true },
        LedgerAppName.Ethereum
    )
}
