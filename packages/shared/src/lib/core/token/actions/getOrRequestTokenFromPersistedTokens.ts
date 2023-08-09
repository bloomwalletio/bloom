import { IPersistedToken } from '../interfaces'
import { requestPersistedToken } from '.'
import { getPersistedAsset } from '../stores'

export async function getOrRequestTokenFromPersistedTokens(
    tokenId: string,
    chainId?: number
): Promise<IPersistedToken | undefined> {
    const persistedAsset = getPersistedAsset(tokenId)
    if (persistedAsset) {
        return Promise.resolve(persistedAsset)
    } else {
        return requestPersistedToken(tokenId, chainId)
    }
}
