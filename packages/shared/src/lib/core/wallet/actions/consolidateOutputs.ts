import { get } from 'svelte/store'
import { selectedAccount, updateSelectedAccount } from '@core/account'
import { handleError } from '@core/error/handlers'
import { processAndAddToActivities } from '@core/activity/utils'
import { network } from '@core/network/stores'

export async function consolidateOutputs(): Promise<void> {
    try {
        const account = get(selectedAccount)
        const networkId = get(network)?.getMetadata()?.id

        if (!account || !networkId) {
            throw new Error('Account or network undefined')
        }

        updateSelectedAccount({ isTransferring: true })

        const consolidationParams = { force: false, outputThreshold: 2 }
        const transaction = await account.consolidateOutputs(consolidationParams)
        await processAndAddToActivities(transaction, account, networkId)
    } catch (err) {
        handleError(err)
    } finally {
        updateSelectedAccount({ isTransferring: false })
    }
}
