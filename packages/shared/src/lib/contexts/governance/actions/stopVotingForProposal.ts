import { get } from 'svelte/store'
import type { Transaction } from '@iota/wallet'
import { selectedAccount, updateSelectedAccount } from '@core/account/stores'
import { showNotification } from '@auxiliary/notification/actions'
import { localize } from '@core/i18n'
import { handleError } from '@core/error/handlers'
import { processAndAddToActivities } from '@core/activity/utils'
import { network } from '@core/network/stores'

export async function stopVotingForProposal(eventId: string): Promise<Transaction> {
    try {
        const account = get(selectedAccount)
        const networkId = get(network)?.getMetadata()?.id

        if (!account || !networkId) {
            throw new Error(localize('error.global.accountOrNetworkUndefined'))
        }

        updateSelectedAccount({ hasVotingTransactionInProgress: true })
        const transaction = await account?.stopParticipating(eventId)

        await processAndAddToActivities(transaction, account, networkId)

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
