import { get } from 'svelte/store'
import { selectedAccount, updateSelectedAccount } from '@core/account/stores'
import { showNotification } from '@auxiliary/notification/actions'
import { localize } from '@core/i18n'
import { handleError } from '@core/error/handlers'
import { processAndAddToActivities } from '@core/activity/utils'
import { sendPreparedTransaction } from '@core/wallet'

export async function vote(eventId?: string, answers?: number[]): Promise<void> {
    const account = get(selectedAccount)
    try {
        updateSelectedAccount({ hasVotingTransactionInProgress: true })

        const preparedTransaction = await account.prepareVote(eventId, answers)
        const transaction = await sendPreparedTransaction(preparedTransaction)

        await processAndAddToActivities(transaction, account)

        showNotification({
            variant: 'success',
            text: localize('notifications.vote.success'),
        })
    } catch (err) {
        updateSelectedAccount({ hasVotingTransactionInProgress: false })
        handleError(err)
    }
}
