import { Transaction } from '@iota/wallet/out/types'
import { getSelectedAccount, updateSelectedAccount } from '@core/account/stores'
import { handleError } from '@core/error/handlers'
import { processAndAddToActivities } from '@core/activity/utils/processAndAddToActivities'
import { localize } from '@core/i18n'
import { getActiveNetworkId } from '@core/network'

export async function setVotingPower(rawAmount: string): Promise<void> {
    try {
        const account = getSelectedAccount()
        const networkId = getActiveNetworkId()

        const votingPower = parseInt(account.votingPower, 10)
        const amount = parseInt(rawAmount, 10)

        updateSelectedAccount({ hasVotingPowerTransactionInProgress: true, isTransferring: true })

        let transaction: Transaction | undefined
        if (amount > votingPower) {
            const amountToIncrease = amount - votingPower
            transaction = await account.increaseVotingPower(amountToIncrease.toString())
        } else if (amount < votingPower) {
            const amountToDecrease = votingPower - amount
            transaction = await account.decreaseVotingPower(amountToDecrease.toString())
        }

        if (transaction) {
            await processAndAddToActivities(transaction, account, networkId)
        } else {
            throw new Error(localize('error.global.generic'))
        }
    } catch (err) {
        handleError(err)
        updateSelectedAccount({ hasVotingPowerTransactionInProgress: false, isTransferring: false })
    }
}
