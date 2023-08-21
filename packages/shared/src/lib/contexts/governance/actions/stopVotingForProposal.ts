import { get } from 'svelte/store'
import { Transaction } from '@iota/sdk/out/types'
import { selectedAccount, updateSelectedAccount } from '@core/account/stores'
import { showNotification } from '@auxiliary/notification/actions'
import { localize } from '@core/i18n'
import { handleError } from '@core/error/handlers'
import { processAndAddToActivities } from '@core/activity/utils'
import { sendPreparedTransaction } from '@core/wallet'

export async function stopVotingForProposal(eventId: string): Promise<Transaction | undefined> {
    const account = get(selectedAccount)
    try {
        updateSelectedAccount({ hasVotingTransactionInProgress: true })
        const preparedTransaction = await account?.prepareStopParticipating(eventId)
        const transaction = await sendPreparedTransaction(preparedTransaction)

        await processAndAddToActivities(transaction, account)

        showNotification({
            variant: 'success',
            text: localize('notifications.stopVoting.success'),
        })
        return transaction
    } catch (err) {
        handleError(err)
        updateSelectedAccount({ hasVotingTransactionInProgress: false })
    }
}
