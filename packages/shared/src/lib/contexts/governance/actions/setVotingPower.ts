import { get } from 'svelte/store'
import { PreparedTransaction } from '@iota/sdk/out/types'
import { selectedAccount, updateSelectedAccount } from '@core/account/stores'
import { handleError } from '@core/error/handlers'
import { processAndAddToActivities } from '@core/activity/utils/processAndAddToActivities'
import { sendPreparedTransaction } from '@core/wallet'
import { localize } from '@core/i18n'
import { getActiveNetworkId } from '@core/network'

export async function setVotingPower(rawAmount: string): Promise<void> {
    try {
        const account = get(selectedAccount)
        const networkId = getActiveNetworkId()

        if (!account || !networkId) {
            throw new Error(localize('error.global.accountOrNetworkUndefined'))
        }
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
