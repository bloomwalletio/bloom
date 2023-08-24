import { selectedAccount, updateSelectedAccount } from '@core/account/stores'
import { processAndAddToActivities } from '@core/activity/utils'
import { handleError } from '@core/error/handlers'
import { sendPreparedTransaction } from '@core/wallet/utils'
import { get } from 'svelte/store'
import { localize } from '@core/i18n'
import { getActiveNetworkId } from '@core/network'

export async function consolidateOutputs(): Promise<void> {
    try {
        const account = get(selectedAccount)
        const networkId = getActiveNetworkId()

        if (!account || !networkId) {
            throw new Error(localize('error.global.accountOrNetworkUndefined'))
        }

        updateSelectedAccount({ isTransferring: true })

        const consolidationParams = { force: false, outputThreshold: 2 }
        const preparedTransaction = await account.prepareConsolidateOutputs(consolidationParams)
        const transaction = await sendPreparedTransaction(preparedTransaction)
        await processAndAddToActivities(transaction, account, networkId)
    } catch (err) {
        handleError(err)
    } finally {
        updateSelectedAccount({ isTransferring: false })
    }
}
