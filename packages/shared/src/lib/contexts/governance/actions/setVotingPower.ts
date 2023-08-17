import { get } from 'svelte/store'
import { PreparedTransaction } from '@iota/sdk/out/types'
import { selectedAccount, updateSelectedAccount } from '@core/account/stores'
import { handleError } from '@core/error/handlers'
import { processAndAddToActivities } from '@core/activity/utils/processAndAddToActivities'

export async function setVotingPower(rawAmount: string): Promise<void> {
    const account = get(selectedAccount)
    try {
        const votingPower = parseInt(account.votingPower, 10)
        const amount = parseInt(rawAmount, 10)

        updateSelectedAccount({ hasVotingPowerTransactionInProgress: true, isTransferring: true })

        let transaction: PreparedTransaction
        if (amount > votingPower) {
            const amountToIncrease = amount - votingPower
            transaction = await account?.prepareVotingPower(amountToIncrease.toString())
        } else if (amount < votingPower) {
            const amountToDecrease = votingPower - amount
            transaction = await account?.prepareDecreaseVotingPower(amountToDecrease.toString())
        } else {
            return
        }
        const tx = await transaction.send()
        await processAndAddToActivities(tx, account)
    } catch (err) {
        handleError(err)
        updateSelectedAccount({ hasVotingPowerTransactionInProgress: false, isTransferring: false })
    }
}
