import { showAppNotification } from '@auxiliary/notification'
import { getSelectedAccount, updateSelectedAccount } from '@core/account'
import { localize } from '@core/i18n'
import { Converter } from '@core/utils'
import { CreateNativeTokenParams } from '@iota/wallet'
import { DEFAULT_TRANSACTION_OPTIONS } from '../constants'
import { VerifiedStatus } from '../enums'
import { buildPersistedAssetFromMetadata } from '../helpers'
import { IIrc30Metadata, IPersistedAsset } from '../interfaces'
import { resetMintTokenDetails } from '../stores'
import { addPersistedAsset } from '../stores/persisted-assets.store'
import { processAndAddToActivities } from '../utils'

export async function mintNativeToken(
    maximumSupply: number,
    circulatingSupply: number,
    metadata: IIrc30Metadata
): Promise<void> {
    try {
        updateSelectedAccount({ isTransferring: true })
        const account = getSelectedAccount()
        if (!account) {
            throw new Error('Account is undefined!')
        }

        const params: CreateNativeTokenParams = {
            maximumSupply: Converter.decimalToHex(maximumSupply),
            circulatingSupply: Converter.decimalToHex(circulatingSupply),
            foundryMetadata: Converter.utf8ToHex(JSON.stringify(metadata)),
        }

        const createTokenTransaction = await account.createNativeToken(params, DEFAULT_TRANSACTION_OPTIONS)
        const persistedAsset: IPersistedAsset = buildPersistedAssetFromMetadata(
            createTokenTransaction.tokenId,
            metadata,
            { verified: true, status: VerifiedStatus.SelfVerified }
        )
        addPersistedAsset(persistedAsset)

        await processAndAddToActivities(createTokenTransaction.transaction, account)

        showAppNotification({
            type: 'success',
            message: localize('notifications.mintNativeToken.success'),
            alert: true,
        })
        resetMintTokenDetails()
    } catch (err) {
        return Promise.reject(err)
    } finally {
        updateSelectedAccount({ isTransferring: false })
    }
}
