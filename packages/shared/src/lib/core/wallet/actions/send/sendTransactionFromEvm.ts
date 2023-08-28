import { getSelectedAccount } from '@core/account/stores'
import { addPersistedTransaction } from '@core/activity/stores'
import { EvmTransactionData } from '@core/layer-2/types'
import { LedgerAppName } from '@core/ledger/enums'
import { IChain } from '@core/network/interfaces'
import { checkActiveProfileAuth } from '@core/profile/actions'

import { signAndSendEvmTransaction } from './signAndSendEvmTransaction'

export async function sendTransactionFromEvm(
    transaction: EvmTransactionData,
    chain: IChain,
    callback?: () => void
): Promise<void> {
    const account = getSelectedAccount()
    if (!account) {
        return
    }
    const provider = chain.getProvider()

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
                if (callback && typeof callback === 'function') {
                    callback()
                }
            }
        },
        { stronghold: true, ledger: true },
        LedgerAppName.Ethereum
    )
}
