import { showNotification } from '@auxiliary/notification'
import { selectedAccount, updateSelectedAccount } from '@core/account/stores/selected-account.store'
import { processAndAddToActivities } from '@core/activity/utils'
import { handleError } from '@core/error/handlers'
import { localize } from '@core/i18n'
import { updateNftInAllAccountNfts } from '@core/nfts/actions'
import { sendPreparedTransaction } from '@core/wallet/utils'
import { get } from 'svelte/store'

export async function burnNft(nftId: string): Promise<void> {
    const account = get(selectedAccount)
    try {
        updateSelectedAccount({ isTransferring: true })
        const preparedTransaction = await account.prepareBurnNft(nftId)
        const burnNftTransaction = await sendPreparedTransaction(preparedTransaction)

        // Generate Activity
        await processAndAddToActivities(burnNftTransaction, account)

        // Update NFT
        updateNftInAllAccountNfts(account.index, nftId, { isSpendable: false })

        showNotification({
            variant: 'success',
            text: localize('notifications.burnNft.success'),
        })
    } catch (err) {
        handleError(err)
        throw err
    } finally {
        updateSelectedAccount({ isTransferring: false })
    }
}
