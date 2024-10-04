import { IAccountState } from '@core/account'
import { generateEvmActivityFromPersistedTransaction, updateActivityByActivityId } from '@core/activity'
import { IEvmNetwork } from '@core/network'
import { LocalEvmTransaction } from '@core/transactions'
import { updatePersistedTransactionWithPartialLocalTransaction } from '@core/transactions/stores'

export async function updatePersistedTransactionAndActivity(
    profileId: string,
    account: IAccountState,
    evmNetwork: IEvmNetwork,
    partialEvmTransaction: Partial<LocalEvmTransaction> & { transactionHash: string }
): Promise<void> {
    // Update local transaction in persisted storage
    const persistedTransaction = updatePersistedTransactionWithPartialLocalTransaction(
        profileId,
        account.index,
        evmNetwork.id,
        partialEvmTransaction
    )

    if (!persistedTransaction) return

    const senderActivity = await generateEvmActivityFromPersistedTransaction(persistedTransaction, evmNetwork, account)

    if (senderActivity) {
        // Update activity on account
        updateActivityByActivityId(account.index, partialEvmTransaction.transactionHash, senderActivity)

        // Optionally update activity on recipient account
        if (senderActivity.recipient?.type === 'account') {
            const recipientAccount = senderActivity.recipient.account
            const persistedTransactionForRecipient = updatePersistedTransactionWithPartialLocalTransaction(
                profileId,
                recipientAccount.index,
                evmNetwork.id,
                partialEvmTransaction
            )

            if (!persistedTransactionForRecipient) return

            const recipientActivity = await generateEvmActivityFromPersistedTransaction(
                persistedTransactionForRecipient,
                evmNetwork,
                recipientAccount
            )
            recipientActivity &&
                updateActivityByActivityId(recipientAccount.index, recipientActivity.id, recipientActivity)
        }
    }
}
