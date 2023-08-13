import { getBaseToken, getCoinType } from '@core/profile/actions'
import { activeAccounts, activeProfile } from '@core/profile/stores'
import { get } from 'svelte/store'
import { getOrRequestTokenFromPersistedTokens } from '../actions'
import { TokenStandard, VerifiedStatus } from '../enums'
import { IPersistedToken } from '../interfaces'
import {
    addPersistedToken,
    clearPersistedTokensForActiveProfile,
    persistedTokens,
} from '../stores/persisted-tokens.store'

export async function refreshAccountTokensForActiveProfile(
    clearPersistedAssets = false,
    keepVerificationStatus = false
): Promise<void> {
    const storedVerificationStates = {}
    if (keepVerificationStatus) {
        const assets = get(persistedTokens)?.[get(activeProfile)?.id] ?? {}
        for (const [id, asset] of Object.entries(assets)) {
            storedVerificationStates[id] = asset.verification
        }
    }
    clearPersistedAssets && clearPersistedTokensForActiveProfile()

    const persistedBaseCoin: IPersistedToken = {
        id: getCoinType(),
        standard: TokenStandard.BaseToken,
        metadata: getBaseToken(),
        hidden: false,
        verification: { verified: true, status: VerifiedStatus.Official },
    }

    const assets: IPersistedToken[] = []
    const accounts = get(activeAccounts)
    for (const account of accounts) {
        const tokens = account?.balances?.nativeTokens ?? []
        for (const token of tokens) {
            try {
                const persistedAsset = await getOrRequestTokenFromPersistedTokens(token.tokenId)
                if (persistedAsset) {
                    if (keepVerificationStatus) {
                        const verificationStatus = storedVerificationStates[persistedAsset.id]
                        persistedAsset.verification = verificationStatus
                    }
                    assets.push(persistedAsset)
                }
            } catch (err) {
                console.error(err)
            }
        }
    }
    addPersistedToken(persistedBaseCoin, ...assets)
}
