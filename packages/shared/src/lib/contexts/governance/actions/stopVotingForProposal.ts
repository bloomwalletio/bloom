import { getSelectedAccount, updateSelectedAccount } from '@core/account/stores'
import { showNotification } from '@auxiliary/notification/actions'
import { localize } from '@core/i18n'
import { handleError } from '@core/error/handlers'
import { processAndAddToActivities } from '@core/activity/utils'
import { getActiveNetworkId } from '@core/network'

export async function stopVotingForProposal(eventId: string): Promise<void> {
    try {
        const account = getSelectedAccount()
        const networkId = getActiveNetworkId()

        if (!account || !networkId) {
            throw new Error(localize('error.global.accountOrNetworkUndefined'))
        }

        updateSelectedAccount({ hasVotingTransactionInProgress: true })
        const transaction = await account.stopParticipating(eventId)

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
