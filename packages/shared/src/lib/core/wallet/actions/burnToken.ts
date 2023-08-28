import { showNotification } from '@auxiliary/notification'
import { getSelectedAccount, updateSelectedAccount } from '@core/account/stores'
import { localize } from '@core/i18n'
import { Converter } from '@core/utils'
import { handleError } from '@core/error/handlers'
import { processAndAddToActivities } from '@core/activity/utils/processAndAddToActivities'
import { getActiveNetworkId } from '@core/network'

export async function burnToken(tokenId: string, rawAmount: string): Promise<void> {
    try {
        const account = getSelectedAccount()
        const networkId = getActiveNetworkId()

        updateSelectedAccount({ isTransferring: true })
        const burnTokenTransaction = await account.burnNativeToken(tokenId, Converter.decimalToHex(Number(rawAmount)))

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
