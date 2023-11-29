import { showNotification } from '@auxiliary/notification'
import { getSelectedAccount, updateSelectedAccount } from '@core/account/stores'
import { processAndAddToActivities } from '@core/activity/utils'
import { localize } from '@core/i18n'
import { Converter } from '@core/utils'
import { CreateNativeTokenParams } from '@iota/sdk/out/types'
import { DEFAULT_TRANSACTION_OPTIONS } from '../constants'
import { resetMintTokenDetails } from '../stores'
import { buildPersistedTokenFromMetadata } from '@core/token/utils'
import { addPersistedToken } from '@core/token/stores'
import { IIrc30Metadata } from '@core/token/interfaces'
import { VerifiedStatus } from '@core/token/enums'
import { sendPreparedTransaction } from '@core/wallet/utils'
import { getActiveNetworkId } from '@core/network'

export async function mintNativeToken(
    maximumSupply: number,
    circulatingSupply: number,
    metadata: IIrc30Metadata
): Promise<void> {
    try {
        const account = getSelectedAccount()
        const networkId = getActiveNetworkId()

        updateSelectedAccount({ isTransferring: true })

        const params: CreateNativeTokenParams = {
            maximumSupply: BigInt(maximumSupply),
            circulatingSupply: BigInt(circulatingSupply),
            foundryMetadata: Converter.utf8ToHex(JSON.stringify(metadata)),
        }
        const preparedTransaction = await account.prepareCreateNativeToken(params, DEFAULT_TRANSACTION_OPTIONS)
        const transaction = await sendPreparedTransaction(preparedTransaction)

        const persistedAsset = buildPersistedTokenFromMetadata(preparedTransaction._tokenId, metadata, {
            verified: true,
            status: VerifiedStatus.SelfVerified,
        })
        addPersistedToken(persistedAsset)

        await processAndAddToActivities(transaction, account, networkId)

        showNotification({
            variant: 'success',
            text: localize('notifications.mintNativeToken.success'),
        })
        resetMintTokenDetails()
    } catch (err) {
        return Promise.reject(err)
    } finally {
        updateSelectedAccount({ isTransferring: false })
    }
}
