import { getSelectedAccount } from '@core/account/stores'
import { addActivitiesToAccountActivitiesInAllAccountActivities, addPersistedTransaction } from '@core/activity/stores'
import { EvmTransactionData } from '@core/layer-2'
import { LedgerAppName } from '@core/ledger'
import { IChain } from '@core/network'
import { checkActiveProfileAuth } from '@core/profile/actions'
import { signAndSendEvmTransaction } from './signAndSendEvmTransaction'
import { generateActivityFromEvmTransaction } from '@core/activity/utils/generateActivityFromEvmTransaction'
import { PersistedEvmTransaction } from '@core/activity'
import { getAddressFromAccountForNetwork } from '@core/account'
import { updateL2BalanceWithoutActivity } from '../updateL2BalanceWithoutActivity'

export async function sendTransactionFromEvm(
    transaction: EvmTransactionData,
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

                const activity = await generateActivityFromEvmTransaction(evmTransaction, networkId, chain)
                addActivitiesToAccountActivitiesInAllAccountActivities(account.index, [activity])

                if (getAddressFromAccountForNetwork(account, networkId) !== activity.subject?.address) {
                    // Currently only support outgoing transactions being added to activities so we can assume outgoing balance change
                    if (activity.tokenTransfer) {
                        await updateL2BalanceWithoutActivity(
                            Number(activity.tokenTransfer.rawAmount),
                            activity.tokenTransfer.tokenId,
                            account,
                            networkId
                        )
                    }
                    await updateL2BalanceWithoutActivity(
                        Number(activity.baseTokenTransfer.rawAmount) + Number(activity?.transactionFee ?? 0),
                        activity.baseTokenTransfer.tokenId,
                        account,
                        networkId
                    )
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
