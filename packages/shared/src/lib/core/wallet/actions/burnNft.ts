import { showNotification } from '@auxiliary/notification'
import { getSelectedAccount, updateSelectedAccount } from '@core/account/stores/selected-account.store'
import { processAndAddToActivities } from '@core/activity/utils'
import { handleError } from '@core/error/handlers'
import { localize } from '@core/i18n'
import { getActiveNetworkId } from '@core/network'
import { updateNftInAllAccountNftsForAccount } from '@core/nfts/actions'
import { sendPreparedTransaction } from '@core/wallet/utils'

export async function burnNft(nftId: string): Promise<void> {
    try {
        const account = getSelectedAccount()
        const networkId = getActiveNetworkId()

        updateSelectedAccount({ isTransferring: true })
        const preparedTransaction = await account.prepareBurnNft(nftId)
        const burnNftTransaction = await sendPreparedTransaction(preparedTransaction)

        // Generate Activity
        await processAndAddToActivities(burnNftTransaction, account, networkId)

        // Update NFT
        updateNftInAllAccountNftsForAccount(account.index, nftId, { isSpendable: false })

        showNotification({
            variant: 'success',
            text: localize('notifications.burnNft.success'),
        })
    } catch (err) {
        handleError(err)
    } finally {
        updateSelectedAccount({ isTransferring: false })
    }
}
