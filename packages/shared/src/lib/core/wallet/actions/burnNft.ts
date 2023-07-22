import { showAppNotification } from '@auxiliary/notification'
import { getSelectedAccount, updateSelectedAccount } from '@core/account/stores'
import { localize } from '@core/i18n'
import { updateNftInAllAccountNfts } from '@core/nfts'
import { handleError } from '@core/error/handlers'
import { processAndAddToActivities } from '../utils'

export async function burnNft(nftId: string): Promise<void> {
    const account = getSelectedAccount()
    try {
        updateSelectedAccount({ isTransferring: true })
        const burnNftTransaction = await account.burnNft(nftId)

        // Generate Activity
        await processAndAddToActivities(burnNftTransaction, account)

        // Update NFT
        updateNftInAllAccountNfts(account.index, nftId, { isSpendable: false })

        showAppNotification({
            type: 'success',
            message: localize('notifications.burnNft.success'),
            alert: true,
        })
    } catch (err) {
        handleError(err)
        throw err
    } finally {
        updateSelectedAccount({ isTransferring: false })
    }
}
