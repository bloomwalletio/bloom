import { showNotification } from '@auxiliary/notification'
import { selectedAccount, updateSelectedAccount } from '@core/account/stores/selected-account.store'
import { processAndAddToActivities } from '@core/activity/utils'
import { handleError } from '@core/error/handlers'
import { localize } from '@core/i18n'
import { getActiveNetworkId } from '@core/network'
import { updateNftInAllAccountNfts } from '@core/nfts/actions'
import { get } from 'svelte/store'

export async function burnNft(nftId: string): Promise<void> {
    try {
        const account = get(selectedAccount)
        const networkId = getActiveNetworkId()

        if (!account || !networkId) {
            throw new Error(localize('error.global.accountOrNetworkUndefined'))
        }

        updateSelectedAccount({ isTransferring: true })
        const burnNftTransaction = await account.burnNft(nftId)

        // Generate Activity
        await processAndAddToActivities(burnNftTransaction, account, networkId)

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
