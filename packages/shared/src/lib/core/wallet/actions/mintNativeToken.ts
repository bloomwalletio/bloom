import { showNotification } from '@auxiliary/notification'
import { getSelectedAccount, updateSelectedAccount } from '@core/account/stores'
import { processAndAddToActivities } from '@core/activity/utils'
import { localize } from '@core/i18n'
import { Converter } from '@core/utils'
import { CreateNativeTokenParams } from '@iota/wallet'
import { DEFAULT_TRANSACTION_OPTIONS } from '../constants'
import { resetMintTokenDetails } from '../stores'
import { buildPersistedTokenFromMetadata } from '@core/token/utils'
import { addPersistedToken } from '@core/token/stores'
import { IIrc30Metadata, IPersistedToken } from '@core/token/interfaces'
import { VerifiedStatus } from '@core/token/enums'
import { getActiveNetworkId } from '@core/network'

export async function mintNativeToken(
    maximumSupply: number,
    circulatingSupply: number,
    metadata: IIrc30Metadata
): Promise<void> {
    try {
        const account = getSelectedAccount()
        const networkId = getActiveNetworkId()

        if (!networkId) {
            throw new Error(localize('error.global.accountOrNetworkUndefined'))
        }
        updateSelectedAccount({ isTransferring: true })

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
        addPersistedToken(persistedAsset)

        await processAndAddToActivities(createTokenTransaction.transaction, account, networkId)

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
