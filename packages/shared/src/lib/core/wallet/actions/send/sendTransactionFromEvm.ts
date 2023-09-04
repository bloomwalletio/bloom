import { getSelectedAccount } from '@core/account/stores'
import { addActivitiesToAccountActivitiesInAllAccountActivities, addPersistedTransaction } from '@core/activity/stores'
import { EvmTransactionData } from '@core/layer-2'
import { LedgerAppName } from '@core/ledger'
import { IChain } from '@core/network'
import { checkActiveProfileAuth } from '@core/profile/actions'
import { signAndSendEvmTransaction } from './signAndSendEvmTransaction'
import { generateActivityFromEvmTransaction } from '@core/activity/utils/generateActivityFromEvmTransaction'
import { PersistedEvmTransaction, calculateAndAddPersistedBalanceChange } from '@core/activity'
import { updateLayer2AccountBalanceForTokenOnChain } from '@core/layer-2/stores'
import { getAddressFromAccountForNetwork } from '@core/account'

export async function sendTransactionFromEvm(
    transaction: EvmTransactionData,
    tokenId: string,
    chain: IChain,
    callback?: () => void
): Promise<void> {
    const account = getSelectedAccount()
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
                const evmTransaction: PersistedEvmTransaction = {
                    ...transaction,
                    ...transactionReceipt,
                }
                addPersistedTransaction(account.index, networkId, evmTransaction)

                const activity = await generateActivityFromEvmTransaction(evmTransaction, tokenId, networkId, provider)
                addActivitiesToAccountActivitiesInAllAccountActivities(account.index, [activity])

                if (getAddressFromAccountForNetwork(account, networkId) !== activity.subject?.address) {
                    // Currently only support outgoing transactions being added to activities so we can assume outgoing balance change
                    const delta = (activity.rawAmount + (activity?.gasUsed ?? 0)) * -1
                    const newBalance = updateLayer2AccountBalanceForTokenOnChain(
                        account.index,
                        networkId,
                        activity.tokenId,
                        delta
                    )
                    calculateAndAddPersistedBalanceChange(account.index, networkId, activity.tokenId, newBalance, true)
                }

                if (callback && typeof callback === 'function') {
                    callback()
                }
            }
        },
        { stronghold: true, ledger: true },
        LedgerAppName.Ethereum
    )
}
