import { showNotification } from '@auxiliary/notification'
import { selectedAccount, updateSelectedAccount } from '@core/account/stores/selected-account.store'
import { localize } from '@core/i18n'
import { updateNftInAllAccountNfts } from '@core/nfts'
import { handleError } from '@core/error/handlers'
import { get } from 'svelte/store'
import { processAndAddToActivities } from '@core/activity/utils'
import { network } from '@core/network'

export async function burnNft(nftId: string): Promise<void> {
    try {
        const account = get(selectedAccount)
        const networkId = get(network)?.getMetadata()?.id

        if (!account || !networkId) {
            throw new Error('Account or network undefined')
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
