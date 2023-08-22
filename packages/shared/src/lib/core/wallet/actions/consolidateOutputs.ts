import { selectedAccount, updateSelectedAccount } from '@core/account/stores'
import { processAndAddToActivities } from '@core/activity/utils'
import { handleError } from '@core/error/handlers'
import { sendPreparedTransaction } from '@core/wallet/utils'
import { get } from 'svelte/store'

export async function consolidateOutputs(): Promise<void> {
    const account = get(selectedAccount)
    if (!account) {
        return
    }
    try {
        updateSelectedAccount({ isTransferring: true })

        const consolidationParams = { force: false, outputThreshold: 2 }
        const preparedTransaction = await account.prepareConsolidateOutputs(consolidationParams)
        const transaction = await sendPreparedTransaction(preparedTransaction)
        await processAndAddToActivities(transaction, account)
    } catch (err) {
        handleError(err)
    } finally {
        updateSelectedAccount({ isTransferring: false })
    }
}
