import { get } from 'svelte/store'
import { selectedAccount, updateSelectedAccount } from '@core/account/stores'
import { showNotification } from '@auxiliary/notification/actions'
import { localize } from '@core/i18n'
import { handleError } from '@core/error/handlers'
import { processAndAddToActivities } from '@core/activity/utils'
import { network } from '@core/network'

export async function vote(eventId?: string, answers?: number[]): Promise<void> {
    try {
        const account = get(selectedAccount)
        const networkId = get(network)?.getMetadata()?.id

        if (!account || !networkId) {
            throw new Error('Account or network undefined')
        }
        updateSelectedAccount({ hasVotingTransactionInProgress: true })

        const transaction = await account.vote(eventId, answers)
        await processAndAddToActivities(transaction, account, networkId)

        showNotification({
            variant: 'success',
            text: localize('notifications.vote.success'),
        })
    } catch (err) {
        updateSelectedAccount({ hasVotingTransactionInProgress: false })
        handleError(err)
    }
}
