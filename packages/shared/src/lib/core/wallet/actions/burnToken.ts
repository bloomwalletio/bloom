import { get } from 'svelte/store'
import { showNotification } from '@auxiliary/notification'
import { selectedAccount, updateSelectedAccount } from '@core/account/stores'
import { localize } from '@core/i18n'
import { handleError } from '@core/error/handlers'
import { processAndAddToActivities } from '@core/activity/utils/processAndAddToActivities'
import { sendPreparedTransaction } from '@core/wallet/utils'
import { getActiveNetworkId } from '@core/network'

export async function burnToken(tokenId: string, rawAmount: string): Promise<void> {
    try {
        const account = get(selectedAccount)
        const networkId = getActiveNetworkId()

        if (!account || !networkId) {
            throw new Error(localize('error.global.accountOrNetworkUndefined'))
        }

        updateSelectedAccount({ isTransferring: true })
        const preparedTransaction = await account?.prepareBurnNativeToken(tokenId, BigInt(rawAmount))
        const burnTokenTransaction = await sendPreparedTransaction(preparedTransaction)

        await processAndAddToActivities(burnTokenTransaction, account, networkId)

        showNotification({
            variant: 'success',
            text: localize('notifications.burnNativeToken.success'),
        })
    } catch (err) {
        handleError(err)
    } finally {
        updateSelectedAccount({ isTransferring: false })
    }
}
