import { getSelectedAccount, updateSelectedAccount } from '@core/account/stores'
import { processAndAddToActivities } from '@core/activity/utils'
import { handleError } from '@core/error/handlers'
import { getActiveNetworkId } from '@core/network'

export async function consolidateOutputs(): Promise<void> {
    try {
        const account = getSelectedAccount()
        const networkId = getActiveNetworkId()

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
