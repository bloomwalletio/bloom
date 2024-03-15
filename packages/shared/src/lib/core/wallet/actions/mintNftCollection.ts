import { showNotification } from '@auxiliary/notification'
import { getSelectedAccount, updateSelectedAccount } from '@core/account/stores'
import { sendPreparedTransaction } from '@core/wallet/utils'
import { localize } from '@core/i18n'
import { IIrc27Metadata } from '@core/nfts'
import { Converter } from '@core/utils'
import { AliasOutputParams } from '@iota/sdk/out/types'
import { getActiveNetworkId } from '@core/network/actions'
import { processAndAddToActivities } from '@core/activity/actions'

export async function mintNftCollection(metadata: IIrc27Metadata): Promise<void> {
    try {
        const account = getSelectedAccount()
        const networkId = getActiveNetworkId()
        updateSelectedAccount({ isTransferring: true })

        const mintNftCollectionParams: AliasOutputParams = {
            // issuer: account.depositAddress, // TODO: uncomment when added to iota-sdk
            immutableMetadata: Converter.utf8ToHex(JSON.stringify(metadata)),
        }

        // Mint NFT
        const preparedTransaction = await account.prepareCreateAliasOutput(mintNftCollectionParams)
        const transaction = await sendPreparedTransaction(preparedTransaction)
        showNotification({
            variant: 'success',
            text: localize('notifications.mintNft.success'),
        })
        await processAndAddToActivities(transaction, account, networkId)
    } catch (err) {
        return Promise.reject(err)
    } finally {
        updateSelectedAccount({ isTransferring: false })
    }
}
