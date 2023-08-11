import { get } from 'svelte/store'
import { selectedAccount, updateSelectedAccount } from '@core/account'
import { handleError } from '@core/error/handlers'
import { processAndAddToActivities } from '@core/activity/utils'

export async function consolidateOutputs(): Promise<void> {
    const account = get(selectedAccount)
    if (!account) {
        return
    }
    try {
        updateSelectedAccount({ isTransferring: true })

        const consolidationParams = { force: false, outputThreshold: 2 }
        const transaction = await account.consolidateOutputs(consolidationParams)
        await processAndAddToActivities(transaction, account)
    } catch (err) {
        handleError(err)
    } finally {
        updateSelectedAccount({ isTransferring: false })
    }
}
