import { showNotification } from '@auxiliary/notification/actions'
import { getSelectedAccount, updateSelectedAccount } from '@core/account/stores'
import { processAndAddToActivities } from '@core/activity/utils'
import { handleError } from '@core/error/handlers'
import { localize } from '@core/i18n'
import { getActiveNetworkId } from '@core/network'
import { sendPreparedTransaction } from '@core/wallet'

export async function stopVotingForProposal(eventId: string): Promise<void> {
    try {
        const account = getSelectedAccount()
        const networkId = getActiveNetworkId()

        updateSelectedAccount({ hasVotingTransactionInProgress: true })
        const preparedTransaction = await account.prepareStopParticipating(eventId)
        const transaction = await sendPreparedTransaction(preparedTransaction)

        await processAndAddToActivities(transaction, account, networkId)

        showNotification({
            variant: 'success',
            text: localize('notifications.stopVoting.success'),
        })
    } catch (err) {
        handleError(err)
        updateSelectedAccount({ hasVotingTransactionInProgress: false })
    }
}
