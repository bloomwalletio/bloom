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
    return new Promise((resolve, reject) => {
        const account = getSelectedAccount()
        const provider = chain.getProvider()
        if (!account) {
            return
        }

        checkActiveProfileAuth(
            async () => {
                try {
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
                    if (callback && typeof callback === 'function') {
                        callback()
                    }
                    resolve(transactionReceipt)
                } catch (err) {
                    reject(err)
                }
            },
            { stronghold: false, ledger: true },
            LedgerAppName.Ethereum
        )
    })
}
