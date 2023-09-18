import { showNotification } from '@auxiliary/notification'
import { getSelectedAccount, updateSelectedAccount } from '@core/account/stores'
import { processAndAddToActivities } from '@core/activity/utils/processAndAddToActivities'
import { handleError } from '@core/error/handlers'
import { localize } from '@core/i18n'
import { getActiveNetworkId } from '@core/network'
import { sendPreparedTransaction } from '@core/wallet/utils'

export async function burnToken(tokenId: string, rawAmount: string): Promise<void> {
    try {
        const account = getSelectedAccount()
        const networkId = getActiveNetworkId()

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
