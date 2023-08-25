import { getSelectedAccount } from '@core/account/stores'
import { addPersistedTransaction } from '@core/activity/stores'
import { EvmTransactionData } from '@core/layer-2'
import { LedgerAppName } from '@core/ledger'
import { IChain } from '@core/network'
import { checkActiveProfileAuth } from '@core/profile/actions'
import { signAndSendEvmTransaction } from './signAndSendEvmTransaction'

export async function sendTransactionFromEvm(transaction: EvmTransactionData, chain: IChain): Promise<void> {
    const account = getSelectedAccount()
    const provider = chain.getProvider()
    if (!account) {
        return
    }

    await checkActiveProfileAuth(
        async () => {
            const networkId = chain.getConfiguration().id
            const chainId = chain.getConfiguration().chainId
            const coinType = chain.getConfiguration().coinType
            const transactionReceipt = await signAndSendEvmTransaction(
                transaction,
                chainId,
                coinType,
                provider,
                account
            )
            if (transactionReceipt) {
                addPersistedTransaction(account.index, networkId, {
                    ...transaction,
                    ...transactionReceipt,
                })
            }
        },
        { stronghold: true, ledger: true },
        LedgerAppName.Ethereum
    )
}
