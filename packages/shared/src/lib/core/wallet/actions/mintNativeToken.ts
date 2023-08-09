import { showNotification } from '@auxiliary/notification'
import { getSelectedAccount, updateSelectedAccount } from '@core/account'
import { localize } from '@core/i18n'
import { Converter } from '@core/utils'
import { CreateNativeTokenParams } from '@iota/wallet'
import { DEFAULT_TRANSACTION_OPTIONS } from '../constants'
import { resetMintTokenDetails } from '../stores'
import { processAndAddToActivities } from '@core/activity/utils'
import { buildPersistedTokenFromMetadata } from '@core/token/utils'
import { addPersistedAsset } from '@core/token/stores'
import { IIrc30Metadata, IPersistedToken } from '@core/token/interfaces'
import { VerifiedStatus } from '@core/token/enums'

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
        const persistedAsset: IPersistedToken = buildPersistedTokenFromMetadata(
            createTokenTransaction.tokenId,
            metadata,
            { verified: true, status: VerifiedStatus.SelfVerified }
        )
        addPersistedAsset(persistedAsset)

        await processAndAddToActivities(createTokenTransaction.transaction, account)

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
