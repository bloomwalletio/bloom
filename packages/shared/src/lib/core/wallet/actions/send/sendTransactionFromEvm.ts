import { getSelectedAccount } from '@core/account/stores'
import { addPersistedTransaction } from '@core/activity/stores'
import { EvmTransactionData } from '@core/layer-2'
import { LedgerAppName } from '@core/ledger'
import { IChain } from '@core/network'
import { checkActiveProfileAuth } from '@core/profile/actions'
import { signAndSendEvmTransaction } from './signAndSendEvmTransaction'

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
            const transactionReceipt = await signAndSendEvmTransaction(
                transaction,
                chain.getConfiguration().chainId,
                provider,
                account
            )
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
