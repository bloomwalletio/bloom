import { get } from 'svelte/store'
import { selectedAccount, updateSelectedAccount } from '@core/account/stores'
import { showNotification } from '@auxiliary/notification/actions'
import { localize } from '@core/i18n'
import { handleError } from '@core/error/handlers'
import { processAndAddToActivities } from '@core/activity/utils'
import { sendPreparedTransaction } from '@core/wallet'
import { getActiveNetworkId } from '@core/network'

export async function stopVotingForProposal(eventId: string): Promise<void> {
    try {
        const account = get(selectedAccount)
        const networkId = getActiveNetworkId()

        if (!account || !networkId) {
            throw new Error(localize('error.global.accountOrNetworkUndefined'))
        }

        updateSelectedAccount({ hasVotingTransactionInProgress: true })
        const preparedTransaction = await account?.prepareStopParticipating(eventId)
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
