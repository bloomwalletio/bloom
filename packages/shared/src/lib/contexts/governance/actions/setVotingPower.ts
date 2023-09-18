import { PreparedTransaction } from '@iota/sdk/out/types'
import { getSelectedAccount, updateSelectedAccount } from '@core/account/stores'
import { processAndAddToActivities } from '@core/activity/utils/processAndAddToActivities'
import { handleError } from '@core/error/handlers'
import { localize } from '@core/i18n'
import { getActiveNetworkId } from '@core/network'
import { sendPreparedTransaction } from '@core/wallet'

export async function setVotingPower(rawAmount: string): Promise<void> {
    try {
        const account = getSelectedAccount()
        const networkId = getActiveNetworkId()

        const votingPower = parseInt(account.votingPower, 10)
        const amount = parseInt(rawAmount, 10)

        updateSelectedAccount({ hasVotingPowerTransactionInProgress: true, isTransferring: true })

        let preparedTransaction: PreparedTransaction
        if (amount > votingPower) {
            const amountToIncrease = amount - votingPower
            preparedTransaction = await account?.prepareIncreaseVotingPower(amountToIncrease.toString())
        } else if (amount < votingPower) {
            const amountToDecrease = votingPower - amount
            preparedTransaction = await account?.prepareDecreaseVotingPower(amountToDecrease.toString())
        } else {
            return
        }
        const transaction = await sendPreparedTransaction(preparedTransaction)

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
