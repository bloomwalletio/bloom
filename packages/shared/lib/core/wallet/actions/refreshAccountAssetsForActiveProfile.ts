import { BASE_TOKEN, COIN_TYPE } from '@core/network'
import { activeAccounts, activeProfile } from '@core/profile'
import { get } from 'svelte/store'
import { addPersistedAsset, clearPersistedAssetForActiveProfile } from '../stores/persisted-assets.store'
import { tryGetAndStoreAssetFromPersistedAssets } from '../actions'
import { VerifiedStatus } from '../enums'
import { IPersistedAsset } from '../interfaces'

export async function refreshAccountAssetsForActiveProfile(clearPersistedAssets = false): Promise<void> {
    clearPersistedAssets && clearPersistedAssetForActiveProfile()

    const networkProtocol = get(activeProfile)?.networkProtocol
    const baseCoin = BASE_TOKEN?.[networkProtocol]
    const persistedBaseCoin: IPersistedAsset = {
        id: String(COIN_TYPE[networkProtocol]),
        standard: 'BASE_COIN',
        metadata: {
            ...baseCoin,
        },
        hidden: false,
        verification: { verified: true, status: VerifiedStatus.Official },
    }

    addPersistedAsset(persistedBaseCoin)

    const accounts = get(activeAccounts)
    for (const account of accounts) {
        const tokens = account?.balances?.nativeTokens ?? []
        for (const token of tokens) {
            try {
                await tryGetAndStoreAssetFromPersistedAssets(token.tokenId)
            } catch (reason) {
                console.error(reason)
            }
        }
    }
}
