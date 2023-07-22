import { getSelectedAccount, updateSelectedAccount } from '@core/account'
import { handleError } from '@core/error/handlers'
import { processAndAddToActivities } from '../utils'

export async function consolidateOutputs(): Promise<void> {
    const account = getSelectedAccount()

    try {
        updateSelectedAccount({ isTransferring: true })

        const transaction = await account.consolidateOutputs(false, 2)
        await processAndAddToActivities(transaction, account)
    } catch (err) {
        handleError(err)
    } finally {
        updateSelectedAccount({ isTransferring: false })
    }
}
