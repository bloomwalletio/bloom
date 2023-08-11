import { showNotification } from '@auxiliary/notification'
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
import { processAndAddToActivities } from '@core/activity/utils'
import { network } from '@core/network'
import { get } from 'svelte/store'

export async function mintNativeToken(
    maximumSupply: number,
    circulatingSupply: number,
    metadata: IIrc30Metadata
): Promise<void> {
    try {
        const account = getSelectedAccount()
        const networkId = get(network)?.getMetadata()?.id

        if (!account || !networkId) {
            throw new Error('Account or network undefined')
        }
        updateSelectedAccount({ isTransferring: true })

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
